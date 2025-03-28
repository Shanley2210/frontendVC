import React, { useState } from 'react';
import {
    loginWithProvider,
    GoogleAuthProvider,
    GithubAuthProvider
} from './firebaseConfig';

const Login = ({ setUser }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleLogin = async (provider) => {
        setLoading(true);
        setError(null);

        const token = await loginWithProvider(provider);
        if (!token) {
            setError(
                'Login failed. Please try again. Your email may already be registered with another provider.'
            );
            setLoading(false);
            return;
        }

        try {
            const res = await fetch(
                'https://backendvideocall-1.onrender.com/auth',
                //'http://localhost:5000/auth',
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ token })
                }
            );

            const data = await res.json();
            console.log('🔹 API Response:', data);

            if (!data.user || !data.user.name) {
                setError('Invalid user data from server');
                return;
            }

            setUser(data.user);
        } catch (err) {
            setError('Server error. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='d-flex justify-content-center align-items-center vh-100'>
            <div className='card shadow-lg p-4' style={{ width: '350px' }}>
                <h3 className='text-center mb-3'>Welcome Back</h3>
                <p className='text-muted text-center'>Login to continue</p>

                {error && (
                    <div className='alert alert-danger text-center'>
                        {error}
                    </div>
                )}

                <button
                    className='btn btn-danger w-100 mb-2 d-flex align-items-center justify-content-center'
                    onClick={() => handleLogin(new GoogleAuthProvider())}
                    disabled={loading}
                >
                    {loading ? (
                        <span className='spinner-border spinner-border-sm me-2'></span>
                    ) : (
                        <i className='fab fa-google me-2'></i>
                    )}
                    Login with Google
                </button>

                <button
                    className='btn btn-dark w-100 d-flex align-items-center justify-content-center'
                    onClick={() => handleLogin(new GithubAuthProvider())}
                    disabled={loading}
                >
                    {loading ? (
                        <span className='spinner-border spinner-border-sm me-2'></span>
                    ) : (
                        <i className='fab fa-github me-2'></i>
                    )}
                    Login with GitHub
                </button>
            </div>
        </div>
    );
};

export default Login;
