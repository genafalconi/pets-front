import { useCallback, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { LOGOUT } from '../../redux/actions';

export default function AutoLogout({ inactivityTime }) {
  const dispatch = useDispatch();
  const timeRef = useRef(null);

  const resetTimer = useCallback(() => {
    const logout = () => {
      dispatch(LOGOUT());
    };
    clearTimeout(timeRef.current);
    timeRef.current = setTimeout(logout, inactivityTime * 60 * 1000);
  }, [inactivityTime, dispatch]);

  useEffect(() => {
    resetTimer();

    document.addEventListener('mousemove', resetTimer);
    document.addEventListener('keypress', resetTimer);
    document.addEventListener('DOMContentLoaded', resetTimer);

    return () => {
      document.removeEventListener('mousemove', resetTimer);
      document.removeEventListener('keypress', resetTimer);
      document.removeEventListener('DOMContentLoaded', resetTimer);
      clearTimeout(timeRef.current);
    };
  }, [resetTimer]);

  return null;
}
