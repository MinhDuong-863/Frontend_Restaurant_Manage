import './App.css'
import Home from './pages/Home/home';
import { PATHS } from "./constant/path";
import { Routes, Route } from "react-router-dom";
import Login from './pages/Login.jsx';
import AdminLayout from './layouts/AdminLayout.jsx';
import StaffLayout from './layouts/StaffLayout.jsx';
import ManagerLayout from './layouts/ManagerLayout.jsx';
import { ConfigProvider } from 'antd';
import InformationPage from './pages/Staff/InformationPage.jsx';
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
        <Route path={PATHS.HOME.HOMEPAGE} element={<Home />} />
        <Route path={PATHS.HOME.LOGIN} element={<Login />} />
        <Route path={PATHS.ADMIN.DASHBOARD} element={<AdminLayout />} >
        </Route>
        <Route path={PATHS.STAFF.INFORMATION} element={<StaffLayout />} >
          <Route index element={<InformationPage />} />


        </Route>
        <Route path={PATHS.MANAGER.DASHBOARD} element={<ManagerLayout />} >

        </Route>
      </Routes>
    </ConfigProvider>
  )
}

export default App
