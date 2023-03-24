import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { REMOVE_LOCK_SUBPROD_USER } from '../../redux/actions';
import Swal from 'sweetalert2';

export default function Timer() {

  const dispatch = useDispatch();
  const navigate = useNavigate()
  const [duration, setDuration] = useState(600000);

  const formatTime = (duration) => {
    const minutes = Math.floor(duration / 60000);
    const seconds = ((duration % 60000) / 1000).toFixed(0);

    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }

  const formattedTime = formatTime(duration);

  useEffect(() => {
    const finishTimer = () => {
      dispatch(REMOVE_LOCK_SUBPROD_USER())
      Swal.fire({
        title: 'Se termino el tiempo!',
        text: 'Volveras a la pantalla inicial',
        icon: 'info'
      }).then(() => {
        window.location = '/'
      })
    }

    const interval = setInterval(() => {
      setDuration(prevDuration => {
        if (prevDuration <= 1000) {
          clearInterval(interval);
          finishTimer()
        }
        return prevDuration - 1000;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [dispatch, navigate, setDuration]);

  return (
    <div className='timer'>
      {formattedTime}
    </div>
  );
}