import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { ConfigProvider, Spin } from 'antd';
import { Outlet } from 'react-router-dom';

const App = () => {
  // const [count, setCount] = useState(0)

  return (
    <ConfigProvider>
      <Outlet />
    </ConfigProvider>
  )
}

export default App
