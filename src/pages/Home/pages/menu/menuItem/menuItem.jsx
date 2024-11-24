import PropTypes from 'prop-types';
import './MenuItem.scss';
import { useState } from 'react';

const MenuItem = ({ item }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const handleModalOpen = () => {
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
    };

    return (
        <div className="menu-item">
            <div className="menu-item-image">
                <img src={item.image} alt={item.name} />
            </div>
            <div className="menu-item-details ">
                <h3 className="menu-item-name">
                    {item.name.length > 55
                        ? `${item.name.substring(0,55)}...`
                        : item.name}
                </h3>
                <p className="menu-item-description">
                    {item.description.length > 100
                        ? `${item.description.substring(0, 100)}...`
                        : item.description}
                </p>
                <div className="menu-item-price-rating">
                    <span className="menu-item-price">
                        {item.price ? `${item.price.toLocaleString()} đ` : 'Thời giá'}
                    </span>
                </div>
                <button className="menu-item-detail-btn" onClick={handleModalOpen}>Chi tiết</button>
            </div>
            {isModalOpen && (
                <div className="menu-item-modal"
                    onClick={(e) => {
                        if (e.target.classList.contains("menu-item-modal")) {
                            handleModalClose();
                        }
                    }}>
                    <div className="menu-item-modal-content">
                        <h3>{item.name}</h3>
                        <img src={item.image} alt={item.name} />
                        <p>{item.description}</p>
                        <p><strong>Giá:</strong> {item.price ? `${item.price.toLocaleString()} đ` : 'Thời giá'}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

MenuItem.propTypes = {
    item: PropTypes.object.isRequired,
};

export default MenuItem;
