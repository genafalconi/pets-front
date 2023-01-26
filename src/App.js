import { Route, Routes } from "react-router-dom";
import Landing from "./components/Home/Landing";
import Login from './components/UserSesion/Login'
import './App.scss'
import 'sweetalert2/src/sweetalert2.scss'
import Register from "./components/UserSesion/Register";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route exact path="/" element={<Landing />} />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/register" element={<Register />} />
      </Routes>
    </div>
  );
}
export default App;
