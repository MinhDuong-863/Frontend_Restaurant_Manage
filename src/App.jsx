import './App.css'
import { PATHS } from "./constant/path";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from './pages/Login.jsx';
import AdminLayout from './layouts/AdminLayout.jsx';
import StaffLayout from './layouts/StaffLayout.jsx';
import ManagerLayout from './layouts/ManagerLayout.jsx';
import AdminPromotion from './pages/Admin/pages/Promotion/adminPromotion.jsx';
import UserLayout from './layouts/UserLayout.jsx';
import HomePages from './pages/Home/pages/homePage/homePages.jsx';
import { ConfigProvider } from 'antd';
import InformationPage from './pages/Staff/InformationPage.jsx';
import ReservatePage from './pages/Home/pages/reservatePage/reservatePage.jsx';
import RecruitmentPage from './pages/Home/pages/recruitmentPage/recruitmentPage.jsx';
import CalendarPage from './pages/Staff/CalendarPage.jsx';
import TablePage from './pages/Staff/TablePage.jsx';
import BookingPage from './pages/Staff/BookingPage.jsx';
import ManagerDashboard from './pages/Manager/DashBoard.jsx';
import ManageStaff from './pages/Manager/ManageStaff.jsx';
import ManageIngredient from './pages/Manager/ManageIngredient.jsx';
import BookingDetails from './pages/Staff/BookingDetails.jsx';
import Recruitment from './pages/Manager/Recruitment.jsx';
import Application from './pages/Manager/Application.jsx';
import FoodManagement from './pages/Manager/Food/ManageFood.jsx';
import LeaveManagement from './pages/Manager/LeaveApplication/LeaveApplicationManagement.jsx';
import ShiftManagement from './pages/Manager/Shift/ShiftManagement.jsx';
import LeaveApplication from './pages/Staff/LeaveApplication.jsx';
import Account from './pages/Home/pages/account/account.jsx';
import OrderManager from './pages/Manager/OrderManager.jsx';
import PromotionManager from './pages/Manager/Promotion/PromotionManager.jsx';
const App = () => {
  // const [count, setCount] = useState(0)

  return (
    <ConfigProvider theme={
      {
        token: {
          fontFamily: "'Montserrat', sans-serif",
        },
        components: {
          Input: {
            activeBorderColor: '#EBEBEB', // Màu viền khi Input được focus
            hoverBorderColor: '#EBEBEB', // Màu viền khi hover
            activeShadow: "0 0 0 2px #F39C121A",
          },
          DatePicker: {

          },
          Button: {
            defaultBorderColor: '#7d4e14', // Màu viền mặc định
            defaultColor: '#7d4e14', // Màu chữ mặc định
            defaultActiveBorderColor: '#7d4e14', // Màu viền khi Button được click
            defaultActiveColor: '#7d4e14', // Màu chữ khi Button được click
            borderRadius: 5,
            colorPrimary: '#F39C12', // Màu nền cho Button chính
            colorPrimaryHover: '#f39d1266', // Màu nền khi hover
            colorPrimaryText: '#ffffff', // Màu chữ trong Button chính
            colorPrimaryBorder: '#ff5722', // Màu viền của Button chính
          },
          Calendar: {
            controlItemBgActive: '#FCF8F2',
            colorPrimary: "#7d4e14"
          },
          Menu: {
            itemBg: '#ffffff', // Màu nền của mục Menu
            itemSelectedBg: '#f39d1266', // Màu nền khi mục Menu được chọn
            itemSelectedColor: '#000000', // Màu chữ khi mục Menu được chọn
          },
          Form: {

            labelColor: '#000000',
            // fontFamily: "'Montserrat', sans-serif",
            fontSize: '16px',
          },
        }
      }
    }>
      <Routes>
        <Route element={<UserLayout />}>
          <Route path={PATHS.HOME.HOMEPAGE} element={<HomePages />} />
          <Route path={PATHS.USER.RESERVATION} element={<ReservatePage />} />
          <Route path={PATHS.USER.RECRUITMENT} element={<RecruitmentPage />} />
          <Route path={PATHS.USER.ACCOUNT} element={<Account />} />
        </Route>
        <Route path={PATHS.HOME.LOGIN} element={<Login />} />
        <Route path={PATHS.ADMIN.DASHBOARD} element={<AdminLayout />} >
          <Route path={PATHS.ADMIN.DASHBOARD} element={<ManagerDashboard />} />
          <Route path={PATHS.ADMIN.PROMOTION} element={<AdminPromotion />} />
        </Route>
        <Route path={"/staff"} element={<StaffLayout />} >
          <Route index element={<Navigate to={PATHS.STAFF.INFORMATION} replace />} />
          <Route path={PATHS.STAFF.INFORMATION} element={<InformationPage />} />
          <Route path={PATHS.STAFF.CALENDAR} element={<CalendarPage />} />
          <Route path={PATHS.STAFF.OFF} element={<LeaveApplication />} />
          <Route path={PATHS.STAFF.TABLE} element={<TablePage />} />
          <Route path={PATHS.STAFF.BOOKING} element={<BookingPage />} />
          <Route path="/staff/booking/details" element={<BookingDetails />} />


        </Route>
        <Route path={PATHS.MANAGER.BASE} element={<ManagerLayout />} >
          <Route index element={<Navigate to={PATHS.MANAGER.DASHBOARD} replace />} />
          <Route path={PATHS.MANAGER.DASHBOARD} element={<ManagerDashboard />} />
          <Route path={PATHS.MANAGER.STAFF} element={<ManageStaff />} />
          <Route path={PATHS.MANAGER.SHIFT} element={<ShiftManagement />} />
          <Route path={PATHS.MANAGER.LEAVE_APPLICATION} element={<LeaveManagement />} />
          <Route path={PATHS.MANAGER.INGREDIENT} element={<ManageIngredient />} />
          <Route path={PATHS.MANAGER.RECRUITMENT} element={<Recruitment />} />
          <Route path={PATHS.MANAGER.APPLICATION} element={<Application />} />
          <Route path={PATHS.MANAGER.ORDERMANAGER} element={<OrderManager />} />
          <Route path={PATHS.MANAGER.FOOD} element={<FoodManagement />} />
          <Route path={PATHS.MANAGER.PROMOTION} element={<PromotionManager />} />
        </Route>
      </Routes>
    </ConfigProvider>

  )
}

export default App
