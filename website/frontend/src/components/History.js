import React, { useState, useEffect } from 'react';
import './History.css';
import houseImage from '../assets/History.jpg';
const History = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [userHistory, setUserHistory] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const fetchUserHistory = async () => {
            try {
                const response = await fetch('http://localhost:8081/api/user/history', {
                    method: 'GET',
                    credentials: 'include',
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch user history');
                }
                const data = await response.json();
                setUserHistory(data.history || []);
            } catch (error) {
                console.error('Error fetching user history:', error);
                alert('An error occurred while fetching user history. Please try again.');
            }
        };

        fetchUserHistory();
    }, []); // Fetch history once on component mount

    const handleDownload = (imageData, source) => {
        const link = document.createElement('a');
        link.href = `data:image/jpeg;base64,${imageData}`;
        link.download = `${source}_${new Date().getTime()}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch('http://localhost:8081/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
                credentials: 'include',
            });
            const data = await response.json();
            if (data.Status === "Success") {
                setIsLoggedIn(true);
            } else {
                alert(data.Error);
            }
        } catch (error) {
            console.error('Error logging in:', error);
            alert('An error occurred during login. Please try again.');
        }
    };

    // Sort userHistory to display images from 'images' first, then '3dmodeloutput'
    const sortedHistory = [...userHistory].sort((a, b) => {
        if (a.source === 'images' && b.source !== 'images') return -1;
        if (a.source !== 'images' && b.source === 'images') return 1;
        return 0;
    });

    return (
        <div className="login-history">
            <img src={houseImage} alt="House-History" className="history-image" />
            {!isLoggedIn ? (
                <form onSubmit={handleSubmit}>
                    <h2>Hello Again!</h2>
                    <div>
                        
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div>

                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    <button type="submit">Sign in</button>

                    <h5>Enter Your Email and Password in order to view your rendered images.</h5>
                </form>
            ) : (
                <div className="history">
                    <h2>All Generated Images</h2>
                    <div className="history-grid">
                        {sortedHistory.length > 0 ? (
                            sortedHistory.map((item, index) => (
                                <div key={index} className="history-item">
                                    <img
                                        src={`data:image/jpeg;base64,${item.image}`}
                                        alt={`Image from ${item.source}`}
                                    />
                                    <button onClick={() => handleDownload(item.image, item.source)}>Download</button>
                                </div>
                            ))
                        ) : (
                            <p>No images found in history.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default History;
