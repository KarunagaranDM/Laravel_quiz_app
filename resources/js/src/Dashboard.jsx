import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { BsClock } from "react-icons/bs";
import axios from 'axios';
import { AuthContext } from "./AuthContext";
import Header from './header';
import QuizImage from '../../../public/Images/quiz1.jpg';


const Dashboard = () => {
    const navigate = useNavigate();
    const [userName, setUserName] = useState('User');
    const [loading, setLoading] = useState(true);
    const { user, logout } = useContext(AuthContext);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/login');
                    return;
                }

                const response = await axios.get('/auth/me', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.data?.user?.name) {
                    setUserName(response.data.user.name);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                if (error.response?.status === 401) {
                    localStorage.removeItem('token');
                    navigate('/login');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [navigate]);

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div>
            <Header />
            <div className='dashboard-container d-flex flex-column justify-content-center align-items-center'>
                <div className='custom-card'>
                    <div className='text-center mt-2 mb-2'>
                        <img src={QuizImage} className='img-fluid' width={300} style={{ borderRadius: '8px' }} />
                    </div>
                    <div className='dashboard-header'>
                        <span className='user-info' style={{ fontSize: '20px' }}>
                            Hello
                            <span className='fw-bold' style={{ color: 'darkblue', textTransform: 'capitalize' }}> {user?.name},</span></span>
                        <div className='quiz-info mt-2'>
                            <h5 className='info-header'>Instructions for Starting and Solving the Quiz</h5>
                            <div>
                                <ol>
                                    <li className='mt-2'>
                                        <span className='quiz-info-desc'>
                                            <span className='quiz-info-head fw-bold'>Read the Questions Carefully -</span>
                                            Make sure you understand each question before selecting an answer.</span>
                                    </li>
                                    <li className='mt-2'>
                                        <span className='quiz-info-desc'>
                                            <span className='quiz-info-head fw-bold'>Time Management -</span>
                                            Pay attention to the timer (if applicable) and allocate time wisely for each question.</span>
                                    </li>
                                    <li className='mt-2'>
                                        <span className='quiz-info-desc'>
                                            <span className='quiz-info-head fw-bold'>Answer Selection -</span>
                                            Click on the correct option.</span>
                                    </li>
                                    <li className='mt-2'>
                                        <span className='quiz-info-desc'>
                                            <span className='quiz-info-head fw-bold'>Navigation -</span>
                                            Use the Next and Previous buttons to move between questions.</span>
                                    </li>
                                    <li className='mt-1'>
                                        <span className='quiz-info-desc'>
                                            <span className='quiz-info-head fw-bold'>Review Before Submitting -</span>
                                            If allowed, review your answers before submitting the quiz.</span>
                                    </li>
                                    <li className='mt-2'>
                                        <span className='quiz-info-desc'>
                                            <span className='quiz-info-head fw-bold'>Final Submission -</span>
                                            Click on the Submit button once you have completed all questions.</span>
                                    </li>
                                    <li className='mt-2'>
                                        <span className='quiz-info-desc'>
                                            <span className='quiz-info-head fw-bold'>Results & Feedback -</span>
                                            After submission, you may receive your score and feedback on the correct answers.
                                        </span>
                                    </li>
                                </ol>
                            </div>
                        </div>
                    </div>
                    <div className='text-center mt-2'>
                        <button
                            onClick={() => navigate('/quiz')}
                            className="btn btn-primary btn-sm"
                        >
                            <span className='d-flex align-items-center' style={{ gap: '0.3em' }}><BsClock />  Start Quiz</span>
                        </button>
                    </div>
                </div>
            </div >
        </div>
    );
};

export default Dashboard;