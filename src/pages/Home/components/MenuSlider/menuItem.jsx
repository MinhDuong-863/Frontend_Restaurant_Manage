import PropTypes from "prop-types";
import "./MenuSlider.scss";

const MenuSlideItem = ({ imageUrl, text }) => {
  return (
    <div className="menu-slide">
      <img src={imageUrl} alt={text} className="menu-slide-img" />
      <div className="menu-slide-text">{text}</div>
    </div>
  );
};

MenuSlideItem.propTypes = {
  imageUrl: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
};

export default MenuSlideItem;
