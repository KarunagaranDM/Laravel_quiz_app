import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from './header';

const ResultPage = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const submissionResponse = location.state?.submissionResponse;
        console.log(submissionResponse);


        if (submissionResponse) {
            setResults(submissionResponse);
            setLoading(false);
        } else {
            navigate('/');
        }
    }, [location.state, navigate]);

    if (loading || !results) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="text-center">
                    <p className="mt-4 text-xl text-gray-600">Loading results...</p>
                </div>
            </div>
        );
    }

    const totalQuestions = results.total_questions || 0;
    const correctAnswers = results.correct_answers || 0;
    const incorrectAnswers = totalQuestions - correctAnswers;
    const feedback = results.feedback || '';
    const score = results.score_percentage || '';

    return (
        <div>
            <Header />
            <div className="d-flex flex-column justify-content-center align-items-center" style={{ height: '100vh' }}>
                <div className="custom-card w-50 text-center">
                    <h1 className="">Quiz Results</h1>
                    <div className='d-flex justify-content-center align-items-center mt-5'>
                        <div className="progress w-50">
                            <div className="progress-bar bg-success" role="progressbar"
                                style={{ width: `${score}%` }}
                                aria-valuenow={score}
                                aria-valuemin="0"
                                aria-valuemax="100">
                                {score}%
                            </div>
                        </div>
                    </div>
                    <div className="d-flex justify-content-around align-items-center mt-4">
                        <div className="">
                            <span className="fw-bold text-secondary">{correctAnswers}</span>
                            <p className="text-success fw-bold">Correct Answers</p>
                        </div>
                        <div className="">
                            <span className="fw-bold text-secondary">{incorrectAnswers}</span>
                            <p className="text-danger fw-bold">Incorrect Answers</p>
                        </div>
                    </div>

                    <div class="alert alert-primary mt-2" role="alert">
                        Info : {feedback}
                    </div>

                    <button
                        onClick={() => navigate('/dashboard')}
                        className="btn btn-warning btn-sm"
                    >
                        Restart Quiz
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ResultPage;