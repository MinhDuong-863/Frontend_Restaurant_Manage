import './App.css'
import Home from './pages/Home/home';
import { PATHS } from "./constant/path";
import { Routes, Route } from "react-router-dom";
import Login from './pages/Login.jsx';
import AdminLayout from './layouts/AdminLayout.jsx';
import StaffLayout from './layouts/StaffLayout.jsx';
import ManagerLayout from './layouts/ManagerLayout.jsx';
const App = () => {
  // const [count, setCount] = useState(0)

  return (
    <Routes>
      <Route path={PATHS.HOME.HOMEPAGE} element={<Home />} />
      <Route path={PATHS.HOME.LOGIN} element={<Login />} />
      <Route path={PATHS.ADMIN.DASHBOARD} element={<AdminLayout />} >

      </Route>
      <Route path={PATHS.STAFF.DASHBOARD} element={<StaffLayout />} >

      </Route>
      <Route path={PATHS.MANAGER.DASHBOARD} element={<ManagerLayout />} >

      </Route>
    </Routes>
  )
}

export default App
