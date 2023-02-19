import Logo from '../../logo.png'
import '../../styles/nav.scss'
import { FiLogIn } from 'react-icons/fi'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Login from '../UserSesion/Login'
import UserOptions from './UserOptions'
import Register from '../UserSesion/Register'
import Cart from './Cart'

export default function Nav() {

  const [modalLogin, setModalLogin] = useState(false)
  const [activeSesion, setActiveSesion] = useState(false)
  const [modalRegister, setModalRegister] = useState(false)

  const token = localStorage.getItem('token')
  const userLocal = localStorage.getItem('user')

  const handleLogin = () => {
    setModalLogin(!modalLogin)
  }

  useEffect(() => {
    if (token && userLocal) {
      if (Object.keys(userLocal).length !== 0) {
        setActiveSesion(true)
      }
    }
  }, [token, userLocal, modalLogin, modalRegister])

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
                <UserOptions />
              </div>
              :
              <div className='link-modal'>
                <FiLogIn className='icon-nav' size={30} onClick={handleLogin} />
              </div>
          }
          <Cart />
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
    </>
  )
}