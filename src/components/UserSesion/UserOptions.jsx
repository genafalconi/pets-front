import Dropdown from 'react-bootstrap/Dropdown';
import '../../styles/components/nav.scss'
import { FaUser } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux';
import { LOGOUT } from '../../redux/actions';
import { useNavigate } from 'react-router-dom';
import { encrypt } from '../../helpers/encryptToken';
import { useEffect } from 'react';

export default function UserOptions({ onHideAddress }) {

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user_admin = JSON.parse(localStorage.getItem('admin'))
  const isAdmin = useSelector((state) => state.clientReducer.user_admin)

  const handleAddress = () => {
    onHideAddress()
  }

  const handleLogout = (event) => {
    event.preventDefault()
    dispatch(LOGOUT())
    navigate('/')
    window.location.reload()
  }

  const handleAdminPage = () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    const userEncripted = encrypt(user)
    const tokenEncripted = encrypt(token)

    const userUrl = encodeURIComponent(userEncripted)
    const tokenUrl = encodeURIComponent(tokenEncripted)

    const url = `${process.env.REACT_APP_ADMIN}?token=${tokenUrl}&user=${userUrl}`;
    window.open(url, '_blank');
  }

  useEffect(() => {

  }, [user_admin, isAdmin])

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
          {
            user_admin && (
              <>
                <Dropdown.Divider />
                <Dropdown.Item onClick={handleAdminPage}>Admin</Dropdown.Item>
              </>
            )
          }
        </Dropdown.Menu>
      </Dropdown>
    </div>
  )
}