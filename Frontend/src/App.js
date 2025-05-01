import React, { useRef } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import HomePage from "./pages/Research Publication Management/HomePage";
import AdminRegister from "./pages/Admin/Register";
import AdminLogin from "./pages/Admin/Login";
import './App.css';
import ResearchPapersManagement from "./pages/Research Publication Management/ResearchPapersManagement";
import AIAssistant from "./pages/Research Discussion & Indexing Function/AIAssistant";
import AddAuthorForm from "./pages/Author Management/AddAuthorForm";
import SearchPage from "./pages/Automated Data Extraction & Source Management/pages/SearchPage";
import TrendingReport from "./pages/Automated Data Extraction & Source Management/pages/TrendingReport";
import SearchLogsManager from "./pages/Automated Data Extraction & Source Management/components/SearchLogsManager";

const AnimatedRoutes = () => {
    const location = useLocation();
    const nodeRef = useRef(null); // 👈 Define a ref for CSSTransition

    return (
        <TransitionGroup>
            <CSSTransition
                key={location.key}
                classNames="fade"
                timeout={300}
                nodeRef={nodeRef} // 👈 Use nodeRef instead of findDOMNode
            >
                <div ref={nodeRef} className="route-container">
                    <Routes location={location}>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/register" element={<AdminRegister />} />
                        <Route path="/login" element={<AdminLogin />} />
                        <Route path="/researchPaperManagement" element={<ResearchPapersManagement />} />
                        <Route path="/aiAssistant" element={<AIAssistant />} />
                        <Route path="/addAuthor" element={<AddAuthorForm />} />
                        <Route path="/searchLogs" element={<SearchPage />} />
                        <Route path="/trendingReport" element={<TrendingReport/>} />
                        <Route path="/searchLogsManagement" element={<SearchLogsManager/>} />
                    </Routes>
                </div>
            </CSSTransition>
        </TransitionGroup>
    );
};

function App() {
    return (
        <Router>
            <AnimatedRoutes />
        </Router>
    );
}

export default App;
