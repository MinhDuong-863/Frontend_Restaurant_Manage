
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './redux/store.jsx';
import { BrowserRouter, Navigate, replace, Route, Routes } from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout.jsx';

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />}>
            <Route path="admin" element={<AdminLayout />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </PersistGate>
  </Provider>
)
