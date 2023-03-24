import './App.scss'
import 'sweetalert2/src/sweetalert2.scss'
import { Route, Routes } from "react-router-dom";
import Landing from "./components/Home/Landing";
import Products from "./components/Product/Products";
import Nav from './components/Home/Nav';
import Checkout from './components/Orders/Checkout';
import Order from './components/Orders/Order';
import ProtectedRoute from './helpers/protectedRoute';

function App() {
  return (
    <div className="App">
      <Nav />
      <Routes>
        <Route exact path="/" element={<Landing />} />
        <Route exact path="/products" element={<Products />} />
        <Route exact path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
        <Route exact path="/orders" element={<ProtectedRoute><Order /></ProtectedRoute>} />
      </Routes>
    </div>
  );
}
export default App;
