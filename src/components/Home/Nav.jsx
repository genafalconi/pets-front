import '../../styles/components/nav.scss'
import { FiLogIn } from 'react-icons/fi'
import { MdSearch } from 'react-icons/md'
import Form from 'react-bootstrap/Form';
import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Login from '../UserSesion/Login'
import UserOptions from '../UserSesion/UserOptions'
import Register from '../UserSesion/Register'
import Cart from './Cart'
import Address from '../Orders/Address'
import { useDispatch, useSelector } from 'react-redux'
import { LOGOUT, SEARCH_PRODUCTS } from '../../redux/actions'
import eventBus from '../../helpers/event-bus'
import { firebaseAuth } from '../../helpers/firebase'
import Dropdown from 'react-bootstrap/Dropdown';
import { AdvancedImage } from '@cloudinary/react'
import { cloudinaryImg } from '../../helpers/cloudinary'
import LazyComponent from '../../helpers/lazyComponents'

const LOGO_PUBLIC_ID = 'Ppales/Logo'

export default function Nav() {

  const [modalLogin, setModalLogin] = useState(false)
  const [activeSesion, setActiveSesion] = useState(false)
  const [modalRegister, setModalRegister] = useState(false)
  const [modalAddress, setModalAddress] = useState(false)
  const [addressUpdated, setAddressUpdated] = useState(false)
  const inputRef = useRef(null)

  const token = localStorage.getItem('token')
  const userLocal = localStorage.getItem('user')
  const { user: userReducer } = useSelector((state) => state.clientReducer)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogin = () => {
    setModalLogin(!modalLogin)
  }

  const handleSearchInput = useCallback(async (value) => {
    await dispatch(SEARCH_PRODUCTS({ input_value: value, page: null })).then((res) => {
      if (res.payload) {
        navigate(`/products?input=${value}`)
      }
    })
  }, [dispatch, navigate])

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearchInput(e?.target?.value);
    }
    if (e.key === ' ') {
      e.stopPropagation();
    }
  };

  useEffect(() => {
    if (token && userLocal) {
      setActiveSesion(true)
    }

    const expiredSesionHandler = () => {
      setActiveSesion(false)
      dispatch(LOGOUT())
    }
    eventBus.on('expired-sesion', expiredSesionHandler)

    const unsubscribe = firebaseAuth.onIdTokenChanged(async (user) => {
      if (user) {
        const newToken = await user.getIdToken()
        localStorage.setItem('token', newToken)
      } else {
        localStorage.removeItem('token')
      }
    })

    if (!token) {
      setModalAddress(false)
    }

    return () => {
      eventBus.off('expired-sesion', expiredSesionHandler)
      unsubscribe()
    }
  }, [token, userLocal, modalLogin, modalRegister, userReducer, dispatch])
  console.log(window.innerWidth)
  return (
    <>
      <nav className='nav'>
        <div className='logo-nav'>
          <Link to={'/'}>
            <AdvancedImage cldImg={cloudinaryImg(LOGO_PUBLIC_ID)} alt='Logo' />
          </Link>
          <div className="search-bar">
            {
              window.innerWidth > 768 ?
                <div className='div-search'>
                  <Form.Control className='input-search' type="text" placeholder='Buscar...' ref={inputRef} onKeyDown={handleKeyDown} />
                  <MdSearch className='action-search-icon' size={25} onClick={() => handleSearchInput(inputRef.current.value)} />
                </div>
                :
                <Dropdown className="d-inline_mx-2">
                  <Dropdown.Toggle id="dropdown-autoclose-true" className='dropdown-custom-search'>
                    <MdSearch className='icon-search' size={25} />
                  </Dropdown.Toggle>
                  <Dropdown.Menu className='dropdown-custom-menu'>
                    <Dropdown.Item className='dropdown-search-item' onClick={(e) => e.stopPropagation()}>
                      <Form.Control className='input-search' type="text" placeholder='Buscar...' ref={inputRef} onKeyDown={handleKeyDown} />
                      <MdSearch className='action-search-icon' size={25} onClick={() => handleSearchInput(inputRef.current.value)} />
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
            }
          </div>
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
                <FiLogIn className='icon-nav' size={25} onClick={handleLogin} />
              </div>
          }
          <LazyComponent>
            <Cart
              onHideLogin={() => setModalLogin(!modalLogin)}
            />
          </LazyComponent>
        </div>
      </nav>
      <LazyComponent>
        <Login
          show={modalLogin}
          onHideLogin={() => setModalLogin(!modalLogin)}
          onHideRegister={() => setModalRegister(!modalRegister)}
        />
      </LazyComponent>
      <LazyComponent>
        <Register
          show={modalRegister}
          onHideLogin={() => setModalLogin(!modalLogin)}
          onHideRegister={() => setModalRegister(!modalRegister)}
        />
      </LazyComponent>
      <LazyComponent>
        <Address
          show={modalAddress}
          onHideAddress={() => setModalAddress(!modalAddress)}
          updateAddress={() => setAddressUpdated(!addressUpdated)}
          fromCheckout={false}
        />
      </LazyComponent>
    </>
  )
}