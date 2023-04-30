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

  const userAuth = useSelector((state) => state.clientReducer.user_auth);
  const token = useSelector((state) => state.clientReducer.token);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const verifyTokenValidity = useCallback(async () => {
    try {
      await dispatch(VERIFY_TOKEN())
        .then((res) => {
          setValidToken(res.payload);
          setIsLoading(false);
        });
    } catch (error) {
      console.log(error);
    }
  }, [dispatch]);

  useEffect(() => {
    const verifyToken = () => {
      if (token && userAuth) {
        verifyTokenValidity();
      } else {
        setIsLoading(false);
        setModalLogin(true);
      }
    };
    verifyToken();

  }, [verifyTokenValidity, token, userAuth]);

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