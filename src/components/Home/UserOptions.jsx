import Dropdown from 'react-bootstrap/Dropdown';
import '../../styles/nav.scss'
import { FaUser } from 'react-icons/fa'
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { LOGOUT } from '../../redux/actions';

export default function UserOptions() {

  const dispatch = useDispatch()

  const handleLogout = (event) => {
    event.preventDefault()
    dispatch(LOGOUT())
    window.location.reload()
  }

  useEffect(() => {
  }, [])

  return (
    <div className="user-nav_sesion_options">
      <Dropdown className="d-inline mx-2">
        <Dropdown.Toggle id="dropdown-autoclose-true" className='dropdown-custom'>
          <FaUser className='user-nav_sesion_icon' size={30} />
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item href="#">Cuenta</Dropdown.Item>
          <Dropdown.Item href="#">Direcciones</Dropdown.Item>
          <Dropdown.Item href="#" onClick={handleLogout}>Cerrar sesion</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  )
}