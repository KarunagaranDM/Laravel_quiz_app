import React, { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Header from './header';
import { AuthContext } from "./AuthContext";

const QuizPreview = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useContext(AuthContext);

    const { questions, answers } = location.state || { questions: [], answers: {} };

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submissionError, setSubmissionError] = useState('');

    const handleSubmit = async () => {
        setIsSubmitting(true);
        setSubmissionError('');

        try {
            const token = localStorage.getItem('token');
            const userId = user.id;
            console.log(userId);


            if (!token || !userId) {
                navigate('/login');
                return;
            }

            const submissionData = {
                questions: questions,
                answers: answers,
                user_id: parseInt(userId), // Convert to integer
                timestamp: new Date().toISOString()
            };

            const response = await axios.post('/submit-quiz', submissionData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            navigate('/results', {
                state: {
                    submissionResponse: response.data.result
                }
            });
        } catch (error) {
            console.error('Submission error:', error);

            if (error.response?.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('user_id');
                navigate('/login');
                return;
            }

            if (error.response) {
                setSubmissionError(
                    error.response.data.errors?.answers ||
                    'Failed to submit quiz. Please try again.'
                );
            } else if (error.request) {
                setSubmissionError('No response received from server');
            } else {
                setSubmissionError('Error preparing quiz submission');
            }

            setIsSubmitting(false);
        }
    };

    const handleEdit = () => {
        navigate(-1);
    };

    if (questions.length === 0) {
        navigate('/');
        return null;
    }

    return (
        <div>
            <Header />
            <div className="quiz-preview-container d-flex flex-column justify-content-center align-items-center py-5">
                {submissionError && (
                    <div class="alert alert-danger w-75 " role="alert">
                        {submissionError}
                    </div>
                )}
                <div className='custom-card w-75'>
                    <h3 style={{ color: 'darkslateblue' }}>Quiz Preview</h3>
                    <div className="summary-section">
                        <h5 style={{ color: 'dimgray', textDecoration: 'underline', marginBottom: '15px' }}>Your Answers :</h5>
                        {questions.map((question, index) => (
                            <div key={question.id} className="preview-question">
                                <p className="question-text">
                                    {index + 1}. {question.category.toUpperCase()}: {question.question}
                                </p>
                                <p className="answer-text">
                                    <strong>Your Answer:</strong> {' '}
                                    {answers[question.id] || 'No answer selected'}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="submission-actions d-flex justify-content-between mt-4 align-items-center">
                        <button
                            onClick={handleEdit}
                            disabled={isSubmitting}
                            className="edit-button btn btn-warning btn-sm"
                        >
                            Edit Answers
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="submit-button btn btn-primary btn-sm"
                        >
                            {isSubmitting ? 'Submitting...' : 'Confirm and Submit'}
                        </button>
                    </div>


                </div>
            </div >
        </div>
    );
};

export default QuizPreview;