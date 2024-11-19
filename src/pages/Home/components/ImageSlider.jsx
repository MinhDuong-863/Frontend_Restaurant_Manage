import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './ImageSlider.scss';

const ImageSlider = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); // Chuyển ảnh sau mỗi 3 giây

    return () => clearInterval(interval); // Dọn dẹp khi component unmount
  }, [images.length]);

  return (
    <div className="slider">
      <div
        className="slider-images"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((image, index) => (
          <img key={index} src={image} alt={`Slide ${index + 1}`} />
        ))}
      </div>
    </div>
  );
};
ImageSlider.propTypes = {
  images: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default ImageSlider;
