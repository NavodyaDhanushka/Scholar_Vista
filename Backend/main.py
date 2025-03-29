from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
from starlette.staticfiles import StaticFiles
from Backend.core.database import engine, Base
from Backend.routers import research_papers, admin, uniqe_function, authors
import uvicorn
app = FastAPI()

# Create tables
Base.metadata.create_all(bind=engine)

# Add CORS middleware to allow requests from specific origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this to your frontend's origin
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allows all headers
)

# Mount static files for serving uploaded PDFs
app.mount("/files", StaticFiles(directory="uploads"), name="files")

# Include Research Paper API
app.include_router(research_papers.router, prefix="/api", tags=["Research Papers"])
app.include_router(admin.router, prefix="/api", tags=["Admin"])

app.include_router(uniqe_function.router, prefix="/api", tags=["Unique Function"])

app.include_router(authors.router, prefix="/api", tags=["Authors"])

@app.get("/")
async def root():
    return {"message": "Welcome to Scholar Vista!"}

# Main function to start FastAPI
if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8010)