// src/App.js
import './App.css';
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './components/Home';
import History from './components/History';
import Gallery from './components/Gallery';
import Create from './components/Create';
import About from './components/About';
import Footer from './components/Footer';
import Login from './components/Login';
import AdminPage from './components/AdminPage';
import Register from './components/Register';
import UploadImagePage from './components/UploadImagePage';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import ImageUpload from './components/ImageUpload';
import UserInputs from './components/UserInputs';
import FloorplanGenerate from './components/generate';
import TDGenerate from './components/3dgenerate';
import ImageGallery from './components/download';

function App() {
  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<Login />} />
        <Route path="/history" element={<History />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/create" element={<Create />} />
        <Route path="/about" element={<About />} />
        <Route path="/adminpage" element={<AdminPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/uploadImagePage" element={<UploadImagePage />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/resetpassword/:token" element={<ResetPassword />} />
        <Route path="/imageupload" element={<ImageUpload />} />
        <Route path="/user-inputs" element={<UserInputs />} />
        <Route path="/generate-2d-plan" element={<FloorplanGenerate />} />
        <Route path="/generate-3d-plan" element={<TDGenerate />} />
        <Route path="/downloadpage" element={<ImageGallery />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
