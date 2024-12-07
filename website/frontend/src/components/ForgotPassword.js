import React, { useState } from 'react';
import "./ForgotPassword.css";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function ForgotPassword() {
    const [values, setValue] = useState({
        email: ''
    });

    const navigate = useNavigate();
    axios.defaults.withCredentials = true;

    const handleSubmit = (event) => {
        event.preventDefault();

        axios.post('http://localhost:8081/forgotpassword', values)
        .then(res => {
            if (res.data.Status === "Success") {
                alert("Email sent! Please check your inbox.");
                navigate('/signin');
            } else {
                alert(res.data.Error);
            }
        })
        .catch(err => {
            console.log(err);
        });
    };

    return (
        <div className="forgotpassword-container">
            <form onSubmit={handleSubmit} className="forgotpassword-form">
                <h2>Forgot Password</h2>

                <div className="mb-3">
                    <label className='email'>Enter your Email.</label>
                    <input
                        type="email"
                        className="form-control"
                        placeholder="Email"
                        name="email"
                        onChange={e => setValue({ ...values, email: e.target.value })}
                        required
                    />
                </div>

                <div className="d-grid">
                    <button type="submit" className="sendemail-btn">
                        Send Email
                    </button>
                </div>

            </form>
        </div>
    );
}

export default ForgotPassword;
