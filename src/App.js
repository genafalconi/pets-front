import './App.scss'
import { Route, Routes } from "react-router-dom";
import Landing from "./components/Home/Landing";
import Products from "./components/Product/Products";
import Nav from './components/Home/Nav';
import Checkout from './components/Orders/Checkout';
import Order from './components/Orders/Order';
import ProtectedRoute from './helpers/protectedRoute';
import LazyComponent from './helpers/lazyComponents';
import Account from './components/AccountInfo/Account';
import AutoLogout from './components/atomic/AutoLogout';
import UserOrders from './components/AccountInfo/UserOrders';

export default function App() {
  return (
    <div className="App">
      <AutoLogout inactivityTime={process.env.REACT_APP_INACTIVITY} />
      <Nav />
      <Routes>
        <Route exact path="/" element={<LazyComponent><Landing /></LazyComponent>} />
        <Route exact path="/products" element={<LazyComponent><Products /></LazyComponent>} />
        <Route exact path="/checkout/:order_type" element={<ProtectedRoute><LazyComponent><Checkout /></LazyComponent></ProtectedRoute>} />
        <Route exact path="/new-order" element={<ProtectedRoute><LazyComponent><Order /></LazyComponent></ProtectedRoute>} />
        <Route exact path="/account" element={<ProtectedRoute><LazyComponent><Account /></LazyComponent></ProtectedRoute>} />
        <Route exact path="/orders/:user_id" element={<ProtectedRoute><LazyComponent><UserOrders /></LazyComponent></ProtectedRoute>} />
      </Routes>
    </div>
  );
}
