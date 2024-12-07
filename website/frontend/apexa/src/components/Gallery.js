import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Gallery.css';

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get('http://localhost:8081/api/gallery-images');
        setImages(response.data.images);
      } catch (error) {
        console.error('Error fetching gallery images:', error);
      }
    };

    fetchImages();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [images.length]);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  if (images.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="gallery-container">
      <img src={images[currentIndex].src} alt={`Gallery ${currentIndex}`} className="gallery-image" />
      <button className="gallery-button prev-button" onClick={handlePrev}>
        &lt;
      </button>
      <button className="gallery-button next-button" onClick={handleNext}>
        &gt;
      </button>
    </div>
  );
};

export default Gallery;
