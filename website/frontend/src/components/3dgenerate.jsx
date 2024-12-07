import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './3d_generate.css'; // Ensure the CSS is correctly imported

const TDGenerate = () => {
  const [images, setImages] = useState([]);
  const [zoomLevel, setZoomLevel] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    // Show the popup message when the component loads
    alert("Your 3D floor plan has been generated successfully");

    fetch('http://localhost:8081/api/3dmodeloutput')
      .then(response => response.json())
      .then(data => setImages(data))
      .catch(error => console.error('Error fetching images:', error));
  }, []);

  const handleDownload = (id) => {
    window.location.href = `http://localhost:8081/api/3dmodeloutput/download/${id}`;
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

  const handleCreateAnotherPlan = () => {
    navigate('/downloadpage'); // Update with your actual route
  };

  const handleZoomIn = () => {
    setZoomLevel(prevZoomLevel => prevZoomLevel + 0.1);
  };

  const handleZoomOut = () => {
    setZoomLevel(prevZoomLevel => prevZoomLevel - 0.1);
  };

  return (
    <div className="image-gallery-container">
      <h2>Your Generated 3D Models</h2>
      <div className="TDimage-gallery">
        {images.map(image => (
          <div key={image.id} className="image-item">
            <h3>3D Model</h3>
            <img
              src={`data:image/jpeg;base64,${arrayBufferToBase64(image.image_data.data)}`}
              alt={`Image ${image.id}`}
              className="gallery-image"
              style={{ transform: `scale(${zoomLevel})` }}
            />
            <button onClick={() => handleDownload(image.id)}>Download</button>
          </div>
        ))}
      </div>
      <button onClick={handleCreateAnotherPlan}>View all your plans</button>
      <div className="zoom-controls">
        <button onClick={handleZoomIn}>Zoom In</button>
        <button onClick={handleZoomOut}>Zoom Out</button>
      </div>
    </div>
  );
};

export default TDGenerate;
