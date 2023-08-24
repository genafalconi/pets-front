import { useEffect, useState, useCallback } from 'react';
import Login from '../components/UserSesion/Login';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { VERIFY_TOKEN } from '../redux/actions';
import Spinner from 'react-bootstrap/Spinner';
import Register from '../components/UserSesion/Register';

export default function ProtectedRoute({ children }) {

  const [modalLogin, setModalLogin] = useState(false);
  const [modalRegister, setModalRegister] = useState(false);
  const [validToken, setValidToken] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { token, user_auth } = useSelector((state) => state.clientReducer);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const verifyTokenValidity = useCallback(() => {
    dispatch(VERIFY_TOKEN())
      .then((res) => {
        setValidToken(res.payload);
        setIsLoading(false);
      });
  }, [dispatch]);

  useEffect(() => {
    const verifyToken = () => {
      if (token && user_auth) {
        verifyTokenValidity();
      } else {
        setIsLoading(false);
        setModalLogin(true);
      }
    };
    verifyToken();

  }, [verifyTokenValidity, token, user_auth]);

  const handleModalClose = () => {
    if (!token && !validToken) {
      navigate('/');
    }
  };

  return (
    <>
      {isLoading ? (
        <div className="loading">
          <Spinner as="span" animation="border" size="lg" role="status" aria-hidden="true" />
        </div>
      ) : (
        <>
          {!token || (token && !validToken) ? (
            modalLogin ?
              <Login
                show={modalLogin}
                onHideLogin={() => setModalLogin(!modalLogin)}
                onHideRegister={() => setModalRegister(!modalRegister)}
                onModalClose={handleModalClose}
              />
              :
              <Register
                show={modalRegister}
                onHideLogin={() => setModalLogin(false)}
                onHideRegister={() => setModalRegister(!modalRegister)}
                onModalClose={handleModalClose}
              />
          ) : (
            children
          )}
        </>
      )}
    </>
  );
};