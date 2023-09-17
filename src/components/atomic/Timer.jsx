import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { REMOVE_LOCK_SUBPROD_USER } from '../../redux/actions';
import Swal from 'sweetalert2';

export default function Timer() {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const endpoint = window.location.href.split('/');
  const ischeckout = endpoint[endpoint.length - 1]

  const initialDuration = 600000

  const { reset_timer } = useSelector((state) => state.clientReducer);
  const [duration, setDuration] = useState(parseInt(initialDuration, 10));

  const formatTime = (duration) => {
    const minutes = Math.floor(duration / 60000);
    const seconds = ((duration % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }

  const formattedTime = formatTime(duration);

  useEffect(() => {
    const savedDuration = localStorage.getItem('timer_duration') && parseInt(localStorage.getItem('timer_duration'));
    if (savedDuration !== null && savedDuration !== '0') {
      setDuration(parseInt(savedDuration, 10));
    } else {
      setDuration(parseInt(initialDuration, 10))
      localStorage.setItem('timer_duration', initialDuration.toString())
    }
  }, [ischeckout]);

  useEffect(() => {
    const finishTimer = () => {
      dispatch(REMOVE_LOCK_SUBPROD_USER());
      Swal.fire({
        title: 'Se terminó el tiempo!',
        icon: 'info'
      })
      navigate('/');
      setDuration(initialDuration)
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

  useEffect(() => {
    const resetTimer = () => {
      setDuration(initialDuration);
      localStorage.setItem('timer_duration', initialDuration.toString())
    };
    resetTimer();
  }, [reset_timer]);

  return (
    <div className='timer'>
      Tiempo restante: {formattedTime}
    </div>
  );
}
