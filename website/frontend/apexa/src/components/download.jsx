import React, { useEffect, useState } from 'react';
import './download.css';

const ImageGallery = () => {
  const [images, setImages] = useState([]);

  useEffect(() => {
      fetch('http://localhost:8081/api/images')
          .then(response => response.json())
          .then(data => setImages(data))
          .catch(error => console.error('Error fetching images:', error));
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

  return (
      <div>
          <h1>Your Image Gallery</h1>
          <div className="image-gallery">
              {images.map(image => (
                  <div key={image.id} className="image-item">
                      <img
                          src={`data:image/jpeg;base64,${arrayBufferToBase64(image.image.data)}`}
                          alt={`Image ${image.id}`}
                      />
                      <button onClick={() => handleDownload(image.id)}>Download</button>
                  </div>
              ))}
          </div>
      </div>
  );
};

export default ImageGallery;