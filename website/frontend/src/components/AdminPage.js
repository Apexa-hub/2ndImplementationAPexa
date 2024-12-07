import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./AdminPage.css";
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AdminPage() {
    const [auth, setAuth] = useState(false);
    const [message, setMessage] = useState('');
    const [name, setName] = useState('');
    const [users, setUsers] = useState([]);
    const [emailToSearch, setEmailToSearch] = useState('');
    const [searchedUser, setSearchedUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('http://localhost:8081/adminpage')
            .then(res => {
                if (res.data.Status === "Success") {
                    setAuth(true);
                    setName(res.data.email);
                    fetchUsers();
                } else {
                    setAuth(false);
                    toast.error(res.data.Error);
                }
            })
            .catch(err => {
                console.error("Error fetching data:", err);
                setAuth(false);
                toast.error("Failed to fetch data");
            });
    }, []);

    const fetchUsers = () => {
        axios.get('http://localhost:8081/user-details')
            .then(res => {
                if (res.data.Status === "Success") {
                    setUsers(res.data.users);
                } else {
                    console.error("Failed to fetch users:", res.data.Error);
                    toast.error("Failed to fetch users");
                }
            })
            .catch(err => {
                console.error("Error fetching users:", err);
                toast.error("Error fetching users");
            });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        axios.get(`http://localhost:8081/search?query=${emailToSearch}`)
            .then(res => {
                if (res.data.Status === "Success") {
                    setSearchedUser(res.data.results[0]); // Assuming single user search
                } else {
                    console.error("User not found:", res.data.Error);
                    toast.error("User not found");
                    setSearchedUser(null);
                }
            })
            .catch(err => {
                console.error("Error searching user:", err);
                toast.error("Error searching user");
                setSearchedUser(null);
            });
    };

    const handleDelete = () => {
        if (!searchedUser) {
            toast.error("No user selected for deletion");
            return;
        }
        axios.delete('http://localhost:8081/deleteuser', {
            data: { email: searchedUser.email }
        })
        .then(res => {
            if (res.data.Status === "Success") {
                fetchUsers();
                setEmailToSearch('');
                setSearchedUser(null);
                toast.success("User deleted successfully");
            } else {
                console.error("Failed to delete user:", res.data.Error);
                toast.error("Failed to delete user");
            }
        })
        .catch(err => {
            console.error("Error deleting user:", err);
            toast.error("Error deleting user");
        });
    };

    const handleLogout = () => {
        axios.get('http://localhost:8081/logout')
            .then(res => {
                if (res.data.Status === "Success") {
                    setAuth(false);
                    navigate('/');
                    toast.success("Logged out successfully");
                } else {
                    console.log("Logout failed: ", res.data.Error);
                    toast.error("Logout failed");
                }
            })
            .catch(err => {
                console.error("Logout error:", err);
                toast.error("Logout error");
            });
    };

    return (
        <div className='admin_container'>
            <ToastContainer />
            {auth ?
                <div>
                    <h3>{name}</h3>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div>
                            <h2>User Details</h2>
                            <table className="user-table">
                                <thead>
                                    <tr>
                                        <th>User name</th>
                                        <th>Email</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map(user => (
                                        <tr key={user.email}>
                                            <td>{user.username}</td>
                                            <td>{user.email}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div style={{ marginLeft: '20px' }}>
                            <div className="search container">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search by email or username"
                                    value={emailToSearch}
                                    onChange={e => setEmailToSearch(e.target.value)}
                                    required
                                />
                                <button type="submit" className="search-btn" onClick={handleSearch}>
                                    Search
                                </button>
                            </div>
                            {searchedUser && (
                                <div className="delete container">
                                    <h3>User to be deleted</h3>
                                    <p>{searchedUser.username} ({searchedUser.email})</p>
                                    <button type="button" className="delete-btn" onClick={handleDelete}>
                                        Delete
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                    <button className='logout-btn' onClick={handleLogout}>Logout</button>
                </div>
                :
                <div>
                    <h3>{message}</h3>
                    <Link to="/Signin" className='logout-btn'>Log in</Link>
                </div>
            }
        </div>
    );
}

export default AdminPage;
