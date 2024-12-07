import React, { useState } from 'react';
import "./Login.css";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
    const [values, setValue] = useState({
        email: '',
        password: ''
    });

    const navigate = useNavigate();
    axios.defaults.withCredentials = true;

    const handleSubmit = (event) => {
        event.preventDefault();

        axios.post('http://localhost:8081/login', values)
        .then(res => {
            if (res.data.Status === "Success") {
                if (res.data.role === "admin") {
                    navigate('/adminpage');
                } else if (res.data.role === "user") {
                    navigate('/uploadImagePage');
                }
            } else {
                alert(res.data.Error);
            }
        })
        .catch(err => {
            console.log(err);
        });
    };

    return (
        <div className="login-container"> 
            <form onSubmit={handleSubmit} className="login-form">
                <h2>Welcome!</h2>

                <div className="mb-3">
                    <input
                        type="email"
                        className="form-control"
                        placeholder="Email"
                        name="email"
                        onChange={e => setValue({ ...values, email: e.target.value })}
                        required
                    />
                </div>

                <div className="mb-3">
                    <input
                        type="password"
                        className="form-control"
                        placeholder="Password"
                        name="password"
                        onChange={e => setValue({ ...values, password: e.target.value })}
                        required
                    />
                </div>

                <div className="d-grid">
                    <button type="submit" className="login-btn">
                        Sign In
                    </button>
                </div>
                <p className="already-have-acc">
                    <Link to='/forgotpassword'>Forgot Password?</Link> 
                </p>
                <p className="already-have-acc">
                    Don't have an account! <Link to='/register'>Sign Up</Link>
                </p>
            </form>
        </div>
    );
}

export default Login;
