import Dropdown from 'react-bootstrap/Dropdown';
import '../../styles/components/nav.scss'
import { FaUser } from 'react-icons/fa'
import { useDispatch } from 'react-redux';
import { LOGOUT } from '../../redux/actions';
import { useNavigate } from 'react-router-dom';

export default function UserOptions({ onHideAddress }) {

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleAddress = () => {
    onHideAddress()
  }

  const handleLogout = (event) => {
    event.preventDefault()
    dispatch(LOGOUT())
    navigate('/')
    window.location.reload()
  }

  return (
    <div className="user-nav_sesion_options">
      <Dropdown className="d-inline_mx-2">
        <Dropdown.Toggle id="dropdown-autoclose-true" className='dropdown-custom'>
          <FaUser className='user-nav_sesion_icon' size={25} />
        </Dropdown.Toggle>
        <Dropdown.Menu className='dropdown-custom-menu'>
          <Dropdown.Item href='/account'>Cuenta</Dropdown.Item>
          <Dropdown.Item onClick={() => handleAddress()}>Direcciones</Dropdown.Item>
          <Dropdown.Item onClick={handleLogout}>Cerrar sesion</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  )
}