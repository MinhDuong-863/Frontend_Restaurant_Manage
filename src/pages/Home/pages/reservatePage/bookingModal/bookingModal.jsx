
import PropTypes from 'prop-types';
import './BookingModal.scss'; // File CSS để style modal

const BookingModal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="booking-modal">
      <div className="booking-modal-content">
        <span className="close-button" onClick={onClose}>
          &times;
        </span>
        {children}
      </div>
    </div>
  );
};
BookingModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node
};

export default BookingModal;
