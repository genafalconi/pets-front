import { useEffect, useState, useCallback } from 'react';
import Login from '../components/UserSesion/Login';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { VERIFY_TOKEN } from '../redux/actions';
import Register from '../components/UserSesion/Register';
import DogAnimation from '../components/atomic/DogAnimation';

export default function ProtectedRoute({ children }) {

  const [modalLogin, setModalLogin] = useState(false);
  const [modalRegister, setModalRegister] = useState(false);
  const [validToken, setValidToken] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { token, user_auth } = useSelector((state) => state.clientReducer);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const verifyTokenValidity = useCallback(() => {
    if (token && user_auth) {
      dispatch(VERIFY_TOKEN())
        .then((res) => {
          setValidToken(res.payload);
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
      setModalLogin(true);
    }
  }, [dispatch, token, user_auth]);

  useEffect(() => {
    verifyTokenValidity();
  }, [verifyTokenValidity]);

  const handleModalClose = () => {
    if (!token && !validToken) {
      navigate('/');
    }
  };

  return (
    <>
      {isLoading ? (
        <DogAnimation />
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