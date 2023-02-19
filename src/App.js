import './App.scss'
import 'sweetalert2/src/sweetalert2.scss'
import { Route, Routes } from "react-router-dom";
import Landing from "./components/Home/Landing";
import Products from "./components/Product/Products";
import Nav from './components/Home/Nav';

function App() {
  return (
    <div className="App">
      <Nav />
      <Routes>
        <Route exact path="/" element={<Landing />} />
        <Route exact path="/productos" element={<Products />} />
      </Routes>
    </div>
  );
}
export default App;
