import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { IoMdArrowForward } from "react-icons/io";
import { IoMdArrowBack } from "react-icons/io";
import Header from './header';

const QuizFlow = () => {
    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/login');
                    return;
                }
                const response = await axios.get('/questions', {
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });

                const fetchedQuestions = response.data.map(q => {
                    let options = [];
                    if (Array.isArray(q.options)) {
                        options = q.options.map(opt =>
                            opt.replace(/^\[|\]$/g, '')
                                .replace(/^"|"$/g, '')
                                .trim()
                        );
                    } else if (typeof q.options === 'string') {
                        options = q.options.split(',')
                            .map(opt =>
                                opt.replace(/^\[|\]$/g, '')
                                    .replace(/^"|"$/g, '')
                                    .trim()
                            );
                    }

                    return {
                        ...q,
                        options: options,
                        correct_answer: q.correct_answer
                            ?.replace(/^\[|\]$/g, '')
                            ?.replace(/^"|"$/g, '')
                            ?.trim()
                    };
                });

                setQuestions(fetchedQuestions);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching questions:', err.response ? err.response.data : err.message);
                setError('Failed to fetch questions');
                setLoading(false);
            }
        };

        fetchQuestions();
    }, []);

    const handleAnswer = (answer) => {
        if (questions[currentQuestion]) {
            setAnswers({
                ...answers,
                [questions[currentQuestion].id]: answer,
            });
        }
    };

    const handleNext = () => {
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        } else {
            navigate('/preview', {
                state: {
                    questions: questions,
                    answers: answers
                }
            });
        }
    };

    const handlePrevious = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;
    if (questions.length === 0) return <div>No questions available</div>;

    const currentQ = questions[currentQuestion];

    if (!currentQ) {
        return <div>Error: Invalid question</div>;
    }

    return (
        <div>
            <Header />
            <div className="quiz-container d-flex flex-column justify-content-center align-items-center" style={{ height: '100vh' }}>
                <div className='custom-card w-75'>
                    <h3 className='mb-3' style={{ color: 'dimgray' }}>Question {currentQuestion + 1} of {questions.length}</h3>
                    <h5><span className='quiz-category' style={{ color: 'darkslateblue' }}>{currentQ.category ? currentQ.category.toUpperCase() : 'Unknown Category'}:</span> {currentQ.question}</h5>
                    <div className="options">
                        {
                            (currentQ.options || []).map((option, index) => {
                                const cleanOption = option
                                    .replace(/^\[|\]$/g, '')
                                    .replace(/^"|"$/g, '');

                                return (
                                    <div key={index} className="option d-flex align-items-center gap-2 mt-1">
                                        <input
                                            type="radio"
                                            id={`option-${index}`}
                                            name="answer"
                                            checked={answers[currentQ.id] === option}
                                            onChange={() => handleAnswer(option)}
                                        />
                                        <label htmlFor={`option-${index}`}>{cleanOption}</label>
                                    </div>
                                );
                            })
                        }
                    </div >
                    <div className="navigation mt-4 d-flex justify-content-between align-items-center">
                        <button className='btn btn-outline-warning btn-sm' onClick={handlePrevious} disabled={currentQuestion === 0}>
                            <span className='d-flex align-items-end' style={{ gap: '0.3em' }}>
                                <IoMdArrowBack style={{ marginBottom: '2px' }} />
                                Previous
                            </span>
                        </button>
                        <button className='btn btn-outline-primary btn-sm' onClick={handleNext}>
                            <span className='d-flex align-items-end' style={{ gap: '0.3em' }}>
                                {currentQuestion === questions.length - 1 ? 'Preview' : 'Next'}
                                <IoMdArrowForward style={{ marginBottom: '2px' }} />
                            </span>
                        </button>
                    </div>
                </div >
            </div >
        </div>
    );
};

export default QuizFlow;