import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { REMOVE_LOCK_SUBPROD_USER } from '../../redux/actions';
import Swal from 'sweetalert2';

export default function Timer() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [duration, setDuration] = useState(600000);

  const formatTime = (duration) => {
    const minutes = Math.floor(duration / 60000);
    const seconds = ((duration % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }

  const formattedTime = formatTime(duration);

  useEffect(() => {
    const savedDuration = localStorage.getItem('timer_duration');
    if (savedDuration) {
      setDuration(parseInt(savedDuration, 10));
    }
  }, []);

  useEffect(() => {
    const finishTimer = () => {
      dispatch(REMOVE_LOCK_SUBPROD_USER());
      Swal.fire({
        title: 'Se terminó el tiempo!',
        text: 'Volverás a la pantalla inicial',
        icon: 'info'
      }).then(() => {
        navigate('/');
      });
    };

    const interval = setInterval(() => {
      setDuration(prevDuration => {
        const newDuration = prevDuration - 1000;
        if (newDuration <= 0) {
          clearInterval(interval);
          finishTimer();
          return 0;
        }
        return newDuration;
      });
    }, 1000);

    return () => {
      clearInterval(interval);
      localStorage.setItem('timer_duration', duration.toString());
    };
  }, [dispatch, navigate, duration]);

  return (
    <div className='timer'>
      Tiempo restante: {formattedTime}
    </div>
  );
}
