import React, { useRef } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import HomePage from "./pages/Research Publication Management/HomePage";
import AdminRegister from "./pages/Admin/Register";
import AdminLogin from "./pages/Admin/Login";
import './App.css';
import ResearchPapersManagement from "./pages/Research Publication Management/ResearchPapersManagement";
import SearchPage from "./pages/search/pages/SearchPage";
import SearchLogsManager from "./pages/search/components/SearchLogsManager";
import TrendingReport from "./pages/search/pages/TrendingReport";
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
                        <Route path="/search" element={<SearchPage />} />
                        <Route path="/searchlogs" element={<SearchLogsManager />} />
                        <Route path="/trending" element={<TrendingReport />} />
                        <Route path="/" element={<HomePage />} />
                        <Route path="/register" element={<AdminRegister />} />
                        <Route path="/login" element={<AdminLogin />} />
                        <Route path="/researchPaperManagement" element={<ResearchPapersManagement />} />
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
