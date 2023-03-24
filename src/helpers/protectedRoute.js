import { useEffect, useState } from 'react';
import Login from '../components/UserSesion/Login';
import { useNavigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {

  const token = localStorage.getItem('token');
  const [modalLogin, setModalLogin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      setModalLogin(true);
    }
  }, [token]);

  const handleModalClose = () => {
    if (!localStorage.getItem('token')) {
      navigate('/');
    }
  };

  return (
    <>
      {!token && (
        <Login
          show={modalLogin}
          onHideLogin={() => setModalLogin(false)}
          onModalClose={() => handleModalClose()}
        />
      )}
      {token && children}
    </>
  );
};
