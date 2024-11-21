import { Select } from 'antd'
import './Recruitment.scss'
import RecruitmentItem from './recruitmentItem'
import { POSITIONS, TYPE_OF_RECRUITMENT } from '../../../../constant/values'
import { useState } from 'react'

const RecruitmentPage = () => {

    const [details, setDetails] = useState([])
    const [SelectedType, setSelectedType] = useState(null)
    const [SelectedPosition, setSelectedPosition] = useState(null)

    const onTypeChange = (value) => {
        setSelectedType(value)
    }

    const onPositionChange = (value) => {
        setSelectedPosition(value)
    }

    return (
        <div className="recruitment-page-container">
            <div className='recruitment-page-title row'>
                <h1>Danh sách tuyển dụng</h1>
                <p style={{textAlign: 'justify'}}>
                    Hãy gia nhập đội ngũ của nhà hàng chúng tôi, nơi tinh hoa ẩm thực và dịch vụ đẳng cấp hòa quyện, để cùng tạo nên những trải nghiệm tuyệt vời cho thực khách!    
                </p>
            </div>
            <div className='recruitment-action row'>
                <div className='col-2'>
                    <Select
                        showSearch
                        placeholder="Chọn vị trí"
                        optionFilterProp="label"
                        onChange={onPositionChange}
                        value={SelectedPosition}
                        options={POSITIONS}
                        style={{width: '100%', height: '3em'}}
                    />
                </div>
                <div className='col-3'>
                    <Select
                        showSearch
                        placeholder="Chọn loại công việc"
                        optionFilterProp="label"
                        onChange={onTypeChange}
                        value={SelectedType}
                        options={TYPE_OF_RECRUITMENT}
                        style={{width: '100%', height: '3em'}}
                    />
                </div>
            </div>
            <div className='recruitment-content mt-3 row'>
                <RecruitmentItem
                    title='Nhân viên phục vụ'
                    content='Yêu cầu: Năng động, nhiệt tình, có tinh thần trách nhiệm, khả năng giao tiếp tốt, có khả năng làm việc nhóm.'
                    details={detail}
                 />
            </div>
        </div>
    )
}

export default RecruitmentPage