import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ResetPassword.css'; //styling

function ResetPassword() {
    const { token } = useParams();
    const [values, setValues] = useState({
        password: '',
        confirmPassword: ''
    });

    const navigate = useNavigate();
    axios.defaults.withCredentials = true;

    const handleSubmit = (event) => {
        event.preventDefault();
        if (values.password !== values.confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        axios.post(`http://localhost:8081/resetpassword/${token}`, { password: values.password })
            .then(res => {
                if (res.data.Status === "Success") {
                    alert("Password reset successfully!");
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
        <div className="resetpassword-container">
            <form onSubmit={handleSubmit} className="resetpassword-form">
                <h2>Reset Password</h2>

                <div className="mb-3">
                    <label className='password'>New Password</label>
                    <input
                        type="password"
                        className="form-control"
                        placeholder="New Password"
                        name="password"
                        onChange={e => setValues({ ...values, password: e.target.value })}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className='confirm-password'>Confirm New Password</label>
                    <input
                        type="password"
                        className="form-control"
                        placeholder="Confirm New Password"
                        name="confirmPassword"
                        onChange={e => setValues({ ...values, confirmPassword: e.target.value })}
                        required
                    />
                </div>

                <div className="d-grid">
                    <button type="submit" className="resetpassword-btn">
                        Reset Password
                    </button>
                </div>
            </form>
        </div>
    );
}

export default ResetPassword;
