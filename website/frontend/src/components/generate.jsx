import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './generate.css';
import SignUpImage from '../assets/SignUpImage.jpg';

const FloorplanGenerate = () => {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [userEmail, setUserEmail] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    toast.success("Your 2D floor plan has been generated successfully");

    fetch('http://localhost:8081/api/images', {
      method: 'GET',
      credentials: 'include' // Ensure cookies are sent
    })
      .then(response => response.json())
      .then(data => setImages(data))
      .catch(error => {
        console.error('Error fetching images:', error);
        toast.error('Error fetching images');
      });

    fetch('http://localhost:8081/api/user/email', {
      method: 'GET',
      credentials: 'include' // Ensure cookies are sent
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => setUserEmail(data.email))
      .catch(error => {
        console.error('Error fetching user email:', error);
        toast.error('Error fetching user email');
      });
  }, []);

  const handleDownload = (id) => {
    window.location.href = `http://localhost:8081/api/images/download/${id}`;
  };

  const arrayBufferToBase64 = (buffer) => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  };

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  const handleInsertImage = () => {
    if (selectedImage) {
      const { id, image } = selectedImage;
      const imageData = {
        image_id: id,
        image_data: arrayBufferToBase64(image.data),
        email: userEmail,
      };

      fetch('http://localhost:8081/api/images/insert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(imageData),
        credentials: 'include' // Ensure cookies are sent
      })
        .then(response => response.json())
        .then(data => {
          if (data.Error) {
            toast.error(data.Error); // Show error message if not authenticated
          } else {
            toast.success('Image inserted successfully');
            console.log('Image inserted successfully:', data);
            navigate('/generate-3d-plan');
          }
        })
        .catch(error => {
          console.error('Error inserting image:', error);
          toast.error('Error inserting image');
        });
    }
  };

  return (
    <div className="app">
      <ToastContainer />
      <img src={SignUpImage} alt="Sign" className="req-image" />
      <div className="image-gallery-container">
        <h2>Your Generated Floor Plan</h2>
        <div className="image-gallery">
          {images.map(image => (
            <div key={image.id} className="image-item">
              <h3>Floor Plan</h3>
              <img
                src={`data:image/jpeg;base64,${arrayBufferToBase64(image.image.data)}`}
                alt={`Image ${image.id}`}
                onClick={() => handleImageClick(image)}
                className="gallery-image"
              />
              <button onClick={() => handleDownload(image.id)}>Download</button>
            </div>
          ))}
        </div>

        {selectedImage && (
          <div className="selected-image-container">
            <h2>Selected Floor Plan</h2>
            <img
              src={`data:image/jpeg;base64,${arrayBufferToBase64(selectedImage.image.data)}`}
              alt={`Image ${selectedImage.id}`}
              className="selected-image"
            />
            <button onClick={handleInsertImage}>Generate 3D View</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FloorplanGenerate;
