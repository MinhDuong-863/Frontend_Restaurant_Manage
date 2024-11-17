import './App.css'
import Home from './pages/Home/home';
import { PATHS } from "./constant/path";
import { Routes, Route } from "react-router-dom";

const App = () => {
  // const [count, setCount] = useState(0)

  return (
    <Routes>
      <Route path={PATHS.HOME.HOMEPAGE} element={<Home/>}/>
    </Routes>
  )
}

export default App
