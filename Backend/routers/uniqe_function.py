import os
import shutil
from operator import itemgetter

from decouple import config
from langchain_community.document_loaders import WebBaseLoader, PyPDFLoader
from langchain_core.prompts.chat import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough, RunnableParallel
from langchain_openai import ChatOpenAI
from langchain_openai import OpenAIEmbeddings
from langchain_qdrant import QdrantVectorStore
from langchain_text_splitters import RecursiveCharacterTextSplitter
from qdrant_client import QdrantClient, models

# Qdrant Configuration
qdrant_api_key = config("QDRANT_API_KEY")
qdrant_url = config("QDRANT_URL")
collection_name = "WebSites"

client = QdrantClient(
    url=qdrant_url,
    api_key=qdrant_api_key
)

# Langchain Model Configuration
model = ChatOpenAI(
    model_name="gpt-4-turbo-preview",
    openai_api_key=config("OPENAI_API_KEY"),
    temperature=0,
)

# Prompt Template
prompt_template = """
Answer the question based on the context, in a concise manner, in markdown and using bullet points where applicable.

Context: {context}
Question: {question}
Answer:
"""

prompt = ChatPromptTemplate.from_template(prompt_template)

# Define Vector Store
vector_store = None


def create_collection_if_not_exists(collection_name):
    try:
        # Try to get the collection
        client.get_collection(collection_name=collection_name)
        print(f"Collection {collection_name} already exists.")
    except Exception as e:
        # If collection doesn't exist, create it
        print(f"Collection {collection_name} does not exist. Creating now...")
        client.create_collection(
            collection_name=collection_name,
            vectors_config=models.VectorParams(size=1536, distance=models.Distance.COSINE)
        )
        print(f"Collection {collection_name} created successfully")


# Ensure collection exists before any operation
create_collection_if_not_exists(collection_name)

# Initialize Vector Store after collection check
vector_store = QdrantVectorStore(
    client=client,
    collection_name=collection_name,
    embedding=OpenAIEmbeddings(
        api_key=os.getenv("OPENAI_API_KEY")
    )
)

# Text Splitter
text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,
    chunk_overlap=20,
    length_function=len
)


# Function to upload website data to collection
def upload_website_to_collection(url: str):
    loader = WebBaseLoader(url)
    docs = loader.load_and_split(text_splitter)
    for doc in docs:
        doc.metadata = {"source_url": url}

    vector_store.add_documents(docs)
    return f"Successfully uploaded {len(docs)} documents to collection {collection_name} from {url}"


# Example upload of website data to collection
# upload_website_to_collection("https://hamel.dev/blog/posts/evals/")

# Langchain RAG setup
retriever = vector_store.as_retriever()


def upload_pdf_to_collection(file_path: str):
    loader = PyPDFLoader(file_path)
    docs = loader.load_and_split(text_splitter)
    for doc in docs:
        doc.metadata = {"source_file": os.path.basename(file_path)}

    vector_store.add_documents(docs)
    return f"Successfully uploaded {len(docs)} documents to collection {collection_name} from {file_path}"


def create_chain():
    chain = (
            {
                "context": retriever.with_config(top_k=4),
                "question": RunnablePassthrough(),
            }
            | RunnableParallel({
        "response": prompt | model,
        "context": itemgetter("context"),
    })
    )
    return chain


def get_answer_and_docs(question: str):
    print(f"Question: {question}")
    chain = create_chain()
    response = chain.invoke(question)
    answer = response["response"].content
    context = response["context"]
    print(f"Answer: {answer}")
    return {
        "answer": answer,
        "context": context
    }


# FastAPI Router setup for chat and indexing
from fastapi import HTTPException, APIRouter, UploadFile, File
from pydantic import BaseModel
from starlette.responses import JSONResponse

router = APIRouter()


# Define the payload structure for /chat
class Message(BaseModel):
    message: str


# Define the payload structure for /indexing
class URLPayload(BaseModel):
    url: str


# Chat endpoint
@router.post("/chat", summary="Chat with the RAG API through this endpoint")
async def chat(payload: Message):
    try:
        # Extract the message from the payload
        message = payload.message
        response = get_answer_and_docs(message)

        # Check if an answer exists
        if not response or not response.get("answer"):
            return JSONResponse(
                content={
                    "question": message,
                    "answer": "I'm sorry, I couldn't find an answer to your question. Please try rephrasing or asking something else.",
                    "document": []
                },
                status_code=200
            )

        # If answer exists, return it
        response_content = {
            "question": message,
            "answer": response["answer"],
            "document": [doc.dict() for doc in response["context"]],
        }
        return JSONResponse(content=response_content, status_code=200)

    except Exception as e:
        # Handle unexpected errors
        print(e)
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")


# Indexing endpoint
@router.post("/indexing", summary="Index a website through this endpoint")
async def indexing(url: str):
    try:
        response = upload_website_to_collection(url)
        return JSONResponse(content={"response": response}, status_code=200)
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)


@router.post("/index-pdf", summary="Index a PDF file through this endpoint")
async def index_pdf(file: UploadFile = File(...)):
    try:
        # Save uploaded file temporarily
        temp_path = f"temp_files/{file.filename}"
        os.makedirs("temp_files", exist_ok=True)
        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Upload to vector store
        response = upload_pdf_to_collection(temp_path)

        # Clean up
        os.remove(temp_path)

        return JSONResponse(content={"response": response}, status_code=200)
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)
