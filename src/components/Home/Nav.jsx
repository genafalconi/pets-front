import Logo from '../../logo.png'
import '../../styles/nav.scss'
import { FiLogIn } from 'react-icons/fi'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Login from '../UserSesion/Login'
import UserOptions from '../UserSesion/UserOptions'
import Register from '../UserSesion/Register'
import Cart from './Cart'
import Address from '../Orders/Address'
import { useSelector } from 'react-redux'

export default function Nav() {

  const [modalLogin, setModalLogin] = useState(false)
  const [activeSesion, setActiveSesion] = useState(false)
  const [modalRegister, setModalRegister] = useState(false)
  const [modalAddress, setModalAddress] = useState(false)

  const token = localStorage.getItem('token')
  const userLocal = localStorage.getItem('user')
  const userReducer = useSelector((state) => state.clientReducer.user)

  const handleLogin = () => {
    setModalLogin(!modalLogin)
  }

  useEffect(() => {
    if (token && userLocal) {
      setActiveSesion(true)
    }
  }, [token, userLocal, modalLogin, modalRegister, userReducer])

  return (
    <>
      <nav className='nav'>
        <div className='logo-nav'>
          <Link to={'/'}>
            <img className='ppal-logo' src={Logo} alt="logoPets" />
          </Link>
        </div>
        <div className='user-nav'>
          {
            activeSesion ?
              <div className='user-nav_sesion'>
                <UserOptions
                  onHideAddress={() => setModalAddress(!modalAddress)}
                />
              </div>
              :
              <div className='link-modal'>
                <FiLogIn className='icon-nav' size={30} onClick={handleLogin} />
              </div>
          }
          <Cart
            onHideLogin={() => setModalLogin(!modalLogin)}
          />
        </div>
      </nav>
      <Login
        show={modalLogin}
        onHideLogin={() => setModalLogin(!modalLogin)}
        onHideRegister={() => setModalRegister(!modalRegister)}
      />
      <Register
        show={modalRegister}
        onHideLogin={() => setModalLogin(!modalLogin)}
        onHideRegister={() => setModalRegister(!modalRegister)}
      />
      <Address
        show={modalAddress}
        onHideAddress={() => setModalAddress(!modalAddress)}
      />
    </>
  )
}