import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Create from './Create';
import './Create.css'; // Import your custom CSS file

function UploadImagePage() {
    const [auth, setAuth] = useState(false);
    const [message, setMessage] = useState('');
    const [name, setName] = useState('');

    useEffect(() => {
        axios.get('http://localhost:8081/uploadImagePage')
            .then(res => {
                if (res.data.Status === "Success") {
                    setAuth(true);
                    setName(res.data.name);
                } else {
                    setAuth(false);
                    setMessage(res.data.Error);
                }
            })
            .catch(err => {
                console.error("Error fetching data:", err);
                setAuth(false); // Ensure auth is false on error
                setMessage("Failed to fetch data");
            });
    }, []); // Empty dependency array to run only once on component mount

    return (
        <div className="upload-image-page">
            {auth ?
                <div className="upload-form">
                    <h3>Welcome to Upload Image page {name}</h3>
                    <Create />
                </div>
                :
                <div>
                    <h3>{message}</h3>
                    <Link to="/signin" className="logout-btn">Log in</Link>
                </div>
            }
        </div>
    );
}

export default UploadImagePage;