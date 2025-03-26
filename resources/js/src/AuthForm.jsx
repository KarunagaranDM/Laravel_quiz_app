import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Eye, EyeOff } from 'lucide-react';
import './AuthForm.css';

const AuthForm = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });

    const navigate = useNavigate();

    useEffect(() => {
        const user = localStorage.getItem("user");
        if (user) {
            navigate("/dashboard");
        }
    }, [navigate]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const validateForm = () => {
        let newErrors = {};
        if (!formData.email) {
            newErrors.email = 'Email is required.';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Invalid email format.';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required.';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters.';
        }

        if (!isLogin && !formData.name) {
            newErrors.name = 'Full name is required.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerError('');

        if (!validateForm()) return;

        try {
            const endpoint = isLogin ? '/auth/login' : '/auth/register';
            const response = await axios.post(endpoint, formData);

            localStorage.setItem('token', response.data.token);
            localStorage.setItem("user", JSON.stringify(response.data?.user));

            navigate('/dashboard');
        } catch (error) {
            setServerError(error.response?.data?.message || 'Authentication failed.');
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="card auth-card shadow-lg">
                <div className="card-body">
                    <h3 className="text-center mb-4">{isLogin ? 'Login' : 'Register'}</h3>

                    {serverError && (
                        <div className="alert alert-danger">{serverError}</div>
                    )}

                    <form onSubmit={handleSubmit}>
                        {!isLogin && (
                            <div className="mb-3">
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Full Name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                    style={{ fontSize: '14px' }}
                                />
                                {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                            </div>
                        )}

                        <div className="mb-3">
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleChange}
                                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                style={{ fontSize: '14px' }}
                            />
                            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                        </div>

                        <div className="mb-3 position-relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="form-control"
                                style={{ fontSize: '14px' }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="eye-icon"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>

                        <button type="submit" className="btn btn-primary w-100" style={{ fontSize: '15px' }}>
                            {isLogin ? 'Login' : 'Register'}
                        </button>
                    </form>

                    <p onClick={() => setIsLogin(!isLogin)} className="text-center mt-3 switch-mode">
                        {isLogin ? (
                            <>
                                Need an account? <span>Register</span>
                            </>
                        ) : (
                            <>
                                Already have an account? <span>Login</span>
                            </>
                        )}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AuthForm;
