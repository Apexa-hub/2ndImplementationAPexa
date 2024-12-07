// ImageUpload.jsx
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudUploadAlt } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import './ImageUpload.css';
import houseImage from '../assets/house.jpg'; 

const ImageUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [fileSizeError, setFileSizeError] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (file) => {
    if (file && (file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg')) {
      if (file.size <= 10 * 1024 * 1024* 1024) { // 10MB limit
        setSelectedFile(file);
        setFileSizeError(false);
      } else {
        setFileSizeError(true);
        setSelectedFile(null);
      }
    } else {
      alert('Only JPEG, JPG, and PNG files are allowed!');
      setSelectedFile(null);
    }
  };

  const handleChange = (e) => {
    const file = e.target.files[0];
    handleFileChange(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files[0];
    handleFileChange(file);
    setDragActive(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  /*const handleSubmit = async () => {
    if (selectedFile && !fileSizeError) {
      const formData = new FormData();
      formData.append('file', selectedFile);
      const fileData = await toBase64(selectedFile);
      
      fetch('http://localhost:8081/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ fileData, fileName: selectedFile.name })
      })
      .then(response => response.text())
      .then(data => {
        console.log(data);
        setUploadComplete(true);
        navigate('/user-inputs'); // Navigate to the user inputs page after upload
      })
      .catch(error => {
        console.error('Error uploading file:', error);
        setUploadComplete(false);
      });
    } else if (fileSizeError) {
      alert('File size exceeds the limit of 10MB.');
    } else {
      alert('Please select a valid image file before submitting.');
    }
  };*/

  const handleSubmit = async () => {
    if (selectedFile && !fileSizeError) {
        const formData = new FormData();
        formData.append('file', selectedFile);
        const fileData = await toBase64(selectedFile);

        fetch('http://localhost:8081/upload', {
            method: 'POST',
            credentials : 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ fileData, fileName: selectedFile.name })
        })
        .then(response => response.text())
        .then(data => {
            console.log(data);
            setUploadComplete(true);
            navigate('/user-inputs'); // Navigate to the user inputs page after upload
        })
        .catch(error => {
            console.error('Error uploading file:', error);
            setUploadComplete(false);
        });
    } else if (fileSizeError) {
        alert('File size exceeds the limit of 10MB.');
    } else {
        alert('Please select a valid image file before submitting.');
    }
};



  const handleCancel = () => {
    setSelectedFile(null);
    setUploadComplete(false);
    setFileSizeError(false);
  };

  const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });

  return (
    <div className='create'>
    <div className="upload-container">
      <h2>Upload an Image</h2>
      <label
        htmlFor="upload-input"
        className={`upload-label ${dragActive ? 'drag-active' : ''} ${selectedFile ? 'file-selected' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        style={{ backgroundImage: selectedFile ? `url(${URL.createObjectURL(selectedFile)})` : 'none' }}
      >
        {!selectedFile && (
          <>
            <FontAwesomeIcon icon={faCloudUploadAlt} className='icon' size="7x" />
            <span><br />Choose an Image or Drag and Drop here!</span>
          </>
        )}
        <input
          type="file"
          accept="image/jpeg,image/png,image/jpg"
          onChange={handleChange}
          style={{ display: 'none' }}
          id="upload-input"
        />
      </label>
      {selectedFile && (
        <div>
          <button onClick={handleSubmit} className="upload-button">Submit</button>
          <button onClick={handleCancel} className="cancel-button">Cancel</button>
        </div>
      )}
    </div>
    </div>
  );
};

export default ImageUpload;
