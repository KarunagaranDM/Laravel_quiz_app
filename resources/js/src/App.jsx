import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AuthForm from "./AuthForm";
import QuizFlow from "./QuizFlow";
import QuizPreview from "./QuizPreview";
import ResultPage from "./ResultPage";
import Dashboard from "./Dashboard";
import AuthProvider from "./AuthContext";
import './App.css';

export default function App() {
    return (
        <Router>
            <AuthProvider>
                <Routes>
                    <Route path="/" element={<Navigate to="login" replace />} />
                    <Route path="/login" element={<AuthForm isLogin={true} />} />
                    <Route path="/register" element={<AuthForm isLogin={false} />} />
                    <Route path="/quiz" element={<QuizFlow />} />
                    <Route path="/preview" element={<QuizPreview />} />
                    <Route path="/results" element={<ResultPage />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                </Routes>
            </AuthProvider>
        </Router>
    );
}

const root = createRoot(document.getElementById("app"));
root.render(<App />);
