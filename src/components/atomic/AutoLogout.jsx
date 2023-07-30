import { useCallback, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { LOGOUT } from '../../redux/actions';

export default function AutoLogout({ inactivityTime }) {
  const dispatch = useDispatch();
  const timeRef = useRef(null);

  const resetTimer = useCallback(() => {
    const token = localStorage.getItem('token')
    const user = localStorage.getItem('user')

    const logout = () => {
      if (token && user) {
        dispatch(LOGOUT()).then((res) => {
          window.location.href = '/';
        });
      }
    };

    clearTimeout(timeRef.current);
    timeRef.current = setTimeout(logout, inactivityTime * 60 * 1000);
  }, [inactivityTime, dispatch]);

  useEffect(() => {
    resetTimer();

    const eventListeners = ['mousemove', 'keypress', 'DOMContentLoaded'];

    const addEventListeners = () => {
      eventListeners.forEach((event) => {
        document.addEventListener(event, resetTimer);
      });
    };

    const removeEventListeners = () => {
      eventListeners.forEach((event) => {
        document.removeEventListener(event, resetTimer);
      });
    };

    addEventListeners();

    return () => {
      removeEventListeners();
      clearTimeout(timeRef.current);
    };
  }, [resetTimer]);

  return null;
}