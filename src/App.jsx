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
import CalendarPage from './pages/Staff/CalendarPage.jsx';
import SendMailPage from './pages/Staff/SendMailPage.jsx';
import TablePage from './pages/Staff/TablePage.jsx';
import BookingPage from './pages/Staff/BookingPage.jsx';
import ManagerDashboard from './pages/Manager/DashBoard.jsx';
import ManageStaff from './pages/Manager/ManageStaff.jsx';
import ManageIngredient from './pages/Manager/ManageIngredient.jsx';
import BookingDetails from './pages/Staff/BookingDetails.jsx';
const App = () => {
  // const [count, setCount] = useState(0)

  return (
    <ConfigProvider theme={
      {
        token: {
          fontFamily: "'Montserrat', sans-serif",
        }
      }
    }>
      <Routes>
        <Route element={<UserLayout />}>
          <Route path={PATHS.HOME.HOMEPAGE} element={<HomePages />} />
          <Route path={PATHS.USER.RESERVATION} element={<ReservatePage />} />
        </Route>
        <Route path={PATHS.HOME.LOGIN} element={<Login />} />
      <Route path={PATHS.ADMIN.DASHBOARD} element={<AdminLayout />} >
          <Route path={PATHS.ADMIN.PROMOTION} element={<AdminPromotion />} />
      </Route>
        <Route path={"/staff"} element={<StaffLayout />} >
          <Route index element={<Navigate to={PATHS.STAFF.INFORMATION} replace />} />
          <Route path={PATHS.STAFF.INFORMATION} element={<InformationPage />} />
          <Route path={PATHS.STAFF.CALENDAR} element={<CalendarPage />} />
          <Route path={PATHS.STAFF.OFF} element={<SendMailPage />} />
          <Route path={PATHS.STAFF.TABLE} element={<TablePage />} />
          <Route path={PATHS.STAFF.BOOKING} element={<BookingPage />} />
          <Route path="/staff/booking/details" element={<BookingDetails />} />


        </Route>
        <Route path={PATHS.MANAGER.BASE} element={<ManagerLayout />} >
          <Route index element={<Navigate to={PATHS.MANAGER.DASHBOARD} replace />} />
          <Route path={PATHS.MANAGER.DASHBOARD} element={<ManagerDashboard />} />
          <Route path={PATHS.MANAGER.STAFF} element={<ManageStaff />} />
          <Route path={PATHS.MANAGER.INGREDIENT} element={<ManageIngredient />} />
        </Route>


      </Routes>
    </ConfigProvider>

  )
}

export default App
