import ImageSlider from '../../components/ImageSlider/ImageSlider';
import MenuSlider from '../../components/MenuSlider/menuSlider';
import './HomePage.scss';

const HomePages = () => {

    const images = [
        'https://res.cloudinary.com/dup39fo44/image/upload/v1732108223/363365339_207965105531678_3534534565980532889_n_zlwffj.jpg',
        'https://res.cloudinary.com/dup39fo44/image/upload/v1732109166/snapedit_1732109144746_kjejlp.png'
      ];

    return (
        <div>
            <div className="home-page-container">
                <div className="home-page-slider">
                    <ImageSlider images={images} />
                    <div className="slider-text">
                        <h1>GASTRONOMY WITH NATURE IN MIND</h1>
                    </div>
                </div>
                <div className="home-page-content">
                    <div className='row stories-content'>
                        <div className='col-12 text-center text-lg-start col-lg-4'>
                            <img src='https://res.cloudinary.com/dup39fo44/image/upload/v1732027062/our_tc1cum.png' alt='Our stories' />
                        </div>
                        <div className='ol-12 p-5 p-lg-0 ms-2 me-5 col-lg-4 ms-lg-0 me-lg-0'>
                            <div className='row justify-content-center'>
                                <p>
                                    “Bếp núc” là một cụm từ dân dã, quen thuộc, gợi nhắc đến công việc giản dị của việc chuẩn bị những bữa ăn trong căn bếp gia đình. Thế nhưng, hoạt động đong đầy hơi ấm này lại hiếm khi được nhắc đến hay nhìn thấy trên bàn ăn, nơi những món ăn được bày biện xa hoa và cầu kỳ.
                                </p>
                                <p style={{fontWeight: '600', fontStyle: 'italic'}}>
                                    Chúng tôi mong muốn thay đổi điều đó. Chúng tôi trân trọng và tôn vinh những nỗ lực thầm lặng đằng sau mỗi món ăn. Chính vì vậy, chúng tôi chọn cái bếp núc – một cách nhấn mạnh rằng những lao động chân thành, từ tình yêu và tâm huyết, chính là cốt lõi của giá trị chúng tôi theo đuổi trong ẩm thực và đồ uống: Thiên nhiên, Việt Nam, và Sáng tạo.
                                </p>
                                <p style={{fontFamily: 'Noto Serif Display', fontSize: '16px', fontStyle: 'italic'}}>
                                    Hãy cùng trải nghiệm với chúng tôi!</p>
                                <img style={{height: '39em'}} src="https://res.cloudinary.com/dup39fo44/image/upload/v1732029408/0945552109_1_wxd9re.png"/>
                            </div>
                        </div>
                        <div className='ol-12 text-center col-lg-4 ms-lg-0 me-lg-0 text-lg-end'>
                            <img src='https://res.cloudinary.com/dup39fo44/image/upload/v1732028934/0945552109_a2e7t0.png' alt='Our stories' />
                            <p className='mt-5 ms-4 me-4 me-lg-3 text-aligh-center text-lg-start' style={{textAlign: 'justify'}}>
                                Tại đây, chúng tôi tin rằng, bằng cách hòa quyện hài hòa giữa truyền thống và những kỹ thuật nấu nướng hiện đại, sáng tạo, chúng tôi có thể biến những món ăn và thức uống giản đơn thành những khoảnh khắc đong đầy thời gian, ký ức và cảm xúc, nơi quá khứ và hiện tại giao thoa một cách trọn vẹn.
                            </p>
                            {/* <button className='d-flex justify-content-start ms-4'>
                                Về chúng tôi
                            </button> */}
                        </div>
                    </div>
                    <div className='row about-content'>
                        <div className='row mb-5 justify-content-center'>
                            <iframe width="952" height="254" src="https://www.youtube.com/embed/EiPwvWKFFNo?list=TLGGNL1hO4NfxTIyMjExMjAyNA" title="AI LOVE AI COCKTAIL | NÚC&#39;S CREATION" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
                        </div>
                        <div className='col-12 col-lg-4 ms-lg-5 about-text'>
                            <p style={{margin: 0, display: 'flex', alignItems: 'flex-end',  height: '100px'}}>OUR</p>
                            <p>CONCEPT</p>
                        </div>
                        <div className='col-12 col-lg-7 concept'>
                            <p>
                                Sáng tạo trong hương vị, lấy cảm hứng từ thiên nhiên.
                            </p>

                            <p>
                                Tastycs không chỉ đơn giản mang đến cho khách hàng một không gian để ăn uống và giao lưu, mà còn cho họ chứng kiến sự hòa quyện ngọt ngào giữa thiên nhiên và ẩm thực. Các đầu bếp sáng tạo của chúng tôi mang đến những trải nghiệm cảm giác và cảm xúc qua các loại rau thơm, trái cây, rau củ, hải sản và thịt tươi. Được thừa hưởng truyền thống Việt Nam, tiếp thêm sức mạnh từ kỹ thuật quốc tế và được thúc đẩy bởi thế giới tự nhiên xung quanh, họ không bị giới hạn trong cách thể hiện hương vị. Triết lý &quot;Ẩm thực lấy cảm hứng từ thiên nhiên&quot; tại Tastycs cho phép khách hàng thưởng thức những hương vị xuất hiện khi sự sáng tạo kết hợp với thiên nhiên.
                            </p>

                            <p>
                                Sự trân trọng của chúng tôi đối môi trường sẽ không thể hoản hảo nếu mà không thực sự bảo vệ chúng. Chúng tôi cam kết bảo vệ môi trường thể hiện nó trong các hoạt động của nhà hàng, bắt đầu bằng những việc sử dụng nguyên liệu sẵn có, theo mùa để giảm thiểu tác động đến môi trường của chúng ta.
                            </p>
                            {/* <button className='d-flex justify-content-start'>
                                Xem Menu
                            </button> */}
                        </div>
                        <div className='col-12 mt-5 col-lg-4 ms-lg-5 about-text text-end'></div>
                        <MenuSlider/>
                    </div>
                    <div className='row about-content'>
                        <div className='col-12 ms-2 col-lg-7 concept'>
                            <p>
                                Chào mừng bạn đến với Tastycs, nơi nghệ thuật ẩm thực hòa quyện cùng sự tinh tế và sang trọng. Tọa lạc tại trung tâm của thành phố phát triển bậc nhất Việt Nam, nhà hàng của chúng tôi là điểm đến lý tưởng cho những ai yêu thích hương vị độc đáo, dịch vụ hoàn hảo, và không gian đẳng cấp.
                            </p>

                            <p>
                                Tại Tastycs, chúng tôi tin rằng ẩm thực không chỉ là món ăn, mà còn là một trải nghiệm đáng nhớ. Đội ngũ đầu bếp tài hoa của chúng tôi, lấy cảm hứng từ những nguyên liệu tươi ngon theo mùa và phong vị toàn cầu, tạo nên thực đơn kết hợp giữa sự sáng tạo và tinh hoa truyền thống.
                            </p>

                            <p>
                                Từng chi tiết, từ ánh sáng ấm áp của không gian sang trọng đến bộ sưu tập rượu vang và cocktail đặc trưng, đều được chăm chút để mang đến trải nghiệm hoàn mỹ. Dù bạn đang kỷ niệm một dấu mốc quan trọng, gặp gỡ đối tác kinh doanh, hay đơn giản là muốn tận hưởng một bữa tối đáng nhớ, chúng tôi hứa hẹn sẽ mang lại cho bạn những khoảnh khắc khó quên.
                            </p>
                            <p>
                                Hãy để chúng tôi dẫn dắt bạn vào hành trình ẩm thực, nơi mỗi món ăn là một câu chuyện, và mỗi phút giây đều trở thành kỷ niệm đáng trân quý. Chào mừng đến với Tastycs—sự hội tụ của hương vị, phong cách và đẳng cấp.
                            </p>
                            {/* <button className='d-flex justify-content-end'>
                                Đặt bàn ngay
                            </button> */}
                        </div>
                        
                        <div className='col-12 col-lg-4 ms-lg-5 about-text text-end'>
                            <p style={{margin: 0, display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end',  height: '100px'}}>ABOUT</p>
                            <p>US</p>
                        </div>
                        
                        <div className='col-12 mt-5 col-lg-4 ms-lg-5 about-text text-end'></div>
                        {/* <MenuSlider/> */}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HomePages;