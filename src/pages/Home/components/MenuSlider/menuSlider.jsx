// ImageSlider.js
import { Swiper, SwiperSlide } from "swiper/react";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './MenuSlider.scss';

const MenuSlider = () => {
  return (
    <div style={{ width: "100%", padding: "20px" }}>
      <Swiper
        spaceBetween={50} // Khoảng cách giữa các hình ảnh
        slidesPerView={4} // Số lượng hình ảnh hiển thị cùng lúc
        loop={true} // Cho phép vòng lặp
        autoplay={{
          delay: 2000, // Thời gian lướt qua mỗi ảnh (2 giây)
        }}
      >
        <SwiperSlide style={{ position: "relative" }}>
          <img
            src="https://res.cloudinary.com/dup39fo44/image/upload/v1732105851/B%E1%BA%BFp_Tr%E1%BB%91ng_%C4%90%E1%BB%93ng_-_Vietnamese_Food_-_Special_Menu_pdtgkm.jpg"
            alt="Image 1"
            style={{ display: "block", width: "100%", height: '27em' }}/>
          <div className="MenuSliderItem">
            Món Việt
          </div>
        </SwiperSlide>
        <SwiperSlide className="menu-slide">
          <img
            src="https://res.cloudinary.com/dup39fo44/image/upload/v1732104215/dress-this-way_taa7dt.jpg"
            alt="Image 1"
            style={{ display: "block", width: "100%", height: '27em' }}/>
          <div className="MenuSliderItem">
            Món Âu
          </div>
        </SwiperSlide>
        <SwiperSlide style={{ position: "relative" }}>
          <img
            src="https://res.cloudinary.com/dup39fo44/image/upload/v1732105547/Perfect_Crispy_Kibbeh_Lebanese_Lamb_Croquettes_futv4k.jpg"
            alt="Image 2"
            style={{ display: "block", width: "100%", height: '27em' }}/>
          <div className="MenuSliderItem">
            Món Trung Đông
          </div>
        </SwiperSlide>
        <SwiperSlide style={{ position: "relative" }}>
          <img
            src="https://res.cloudinary.com/dup39fo44/image/upload/v1732104232/54908608-109d-45c9-b25f-238e8e00c72c_b368ac.jpg"
            alt="Image 3"
            style={{ display: "block", width: "100%", height: '27em' }}/>
          <div className="MenuSliderItem">
            Món Á
          </div>
        </SwiperSlide>
        <SwiperSlide style={{ position: "relative" }}>
          <img
            src="https://res.cloudinary.com/dup39fo44/image/upload/v1732104216/7238fb67-3414-4cd3-b45a-7814c24a0f98_vdnb1o.jpg"
            alt="Image 4"
            style={{ display: "block", width: "100%", height: '27em' }}/>
          <div className="MenuSliderItem">
            Món Mỹ
          </div>
        </SwiperSlide>
        <SwiperSlide style={{ position: "relative" }}>
          <img
            src="https://res.cloudinary.com/dup39fo44/image/upload/v1732105753/Japanese_Food_Poster_z6vwze.jpg"
            alt="Image 1"
            style={{ display: "block", width: "100%", height: '27em' }}/>
          <div className="MenuSliderItem">
            Món Nhật
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

export default MenuSlider;
