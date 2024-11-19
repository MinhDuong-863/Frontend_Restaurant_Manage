import ImageSlider from '../../components/ImageSlider';
import './HomePage.scss';

const HomePages = () => {

    const images = [
        'https://via.placeholder.com/800x400?text=Image+1',
        'https://via.placeholder.com/800x400?text=Image+2',
        'https://via.placeholder.com/800x400?text=Image+3',
      ];

    return (
        <div>
            <div className="home-page-container">
                <div className="home-page-slider">
                    <ImageSlider images={images} />
                </div>
                <div className="home-page-content">
                    <div className='row'>
                        <div className='col-4'>
                            <img src='https://res.cloudinary.com/dup39fo44/image/upload/v1732027062/our_tc1cum.png' alt='Our stories' />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HomePages;