import './index.css';

import React from 'react';
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PrivateRoute, { AdminRoute } from './components/privateProute';


import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './redux/store';


import Home from './pages/Home';
import Login from './pages/login';
import Register from './pages/register';
import Account from './pages/account';
import AdminPanel from './pages/adminPanel';
import Error from './pages/error';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
      <BrowserRouter>
        <Routes>
            <Route path="/" element={<Home />}/>
            <Route path="/login" element={<Login />}/>
            <Route path="/register" element={<Register />}/>
            <Route path='/account' element={<PrivateRoute children={<Account/>}/>}/> 
            <Route path='/adminPanel' element={<AdminRoute children={<AdminPanel/>}/>}/> 
            <Route path="*" element={<Error />} />
        </Routes>
      </BrowserRouter>
  </Provider>
);

