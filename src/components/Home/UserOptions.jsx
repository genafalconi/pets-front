import Dropdown from 'react-bootstrap/Dropdown';
import '../../styles/nav.scss'
import { FaUser } from 'react-icons/fa'
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { LOGOUT } from '../../redux/actions';

export default function UserOptions() {

  const dispatch = useDispatch()
  const [openOptions, setOpenOptions] = useState(false)

  const handleOptionsUser = () => {
    setOpenOptions(!openOptions)
  }

  const handleLogout = (event) => {
    event.preventDefault()
    dispatch(LOGOUT()) 
    window.location.reload()
  }
  return (
    <Dropdown className="d-inline mx-2">
      <Dropdown.Toggle id="dropdown-autoclose-true" className='dropdown-custom'>
        <FaUser className='user-nav_sesion_icon' onClick={handleOptionsUser} size={30} />
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <Dropdown.Item href="#">Cuenta</Dropdown.Item>
        <Dropdown.Item href="#">Direcciones</Dropdown.Item>
        <Dropdown.Item href="#" onClick={handleLogout}>Cerrar sesion</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  )
}