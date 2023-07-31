import '../../styles/components/nav.scss'
import { FiLogIn } from 'react-icons/fi'
import { MdSearch } from 'react-icons/md'
import Form from 'react-bootstrap/Form';
import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Login from '../UserSesion/Login'
import UserOptions from '../UserSesion/UserOptions'
import Register from '../UserSesion/Register'
import Cart from './Cart'
import Address from '../Orders/Address'
import { useDispatch, useSelector } from 'react-redux'
import { LOGOUT } from '../../redux/actions'
import eventBus from '../../helpers/event-bus'
// import { firebaseAuth } from '../../helpers/firebase'
import Dropdown from 'react-bootstrap/Dropdown';
import { AdvancedImage } from '@cloudinary/react'
import { cloudinaryImg } from '../../helpers/cloudinary'
import LazyComponent from '../../helpers/lazyComponents'
import { endpoints } from '../../helpers/constants';
import { validateSearchInput } from '../../helpers/validateInputs';

const LOGO_PUBLIC_ID = 'Ppales/Logo'

export default function Nav() {

  const [modalLogin, setModalLogin] = useState(false)
  const [activeSesion, setActiveSesion] = useState(false)
  const [modalRegister, setModalRegister] = useState(false)
  const [modalAddress, setModalAddress] = useState(false)
  const [addressUpdated, setAddressUpdated] = useState(false)
  const [showCart, setShowCart] = useState(true)
  const [searchInput, setSearchInput] = useState('')
  const [inputErrors, setInputErrors] = useState(null)
  const inputRef = useRef(null)

  const animal = new URLSearchParams(useLocation().search).get("animal");
  const endpoint = window.location.pathname
  const token = localStorage.getItem('token')
  const userLocal = localStorage.getItem('user')
  const { user: userReducer } = useSelector((state) => state.clientReducer)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogin = () => {
    setModalLogin(!modalLogin)
  }

  const handleSearchInput = (value) => {
    let query = '';
    if (value) {
      query = `?input=${value}`;
    }
    if (animal) {
      if (query) {
        query += `&animal=${animal}`;
      } else {
        query = `?animal=${animal}`;
      }
    }
    navigate(`/products${query}`);
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearchInput(e?.target?.value);
    }
    if (e.key === ' ') {
      e.stopPropagation();
    }
  };

  const validateInput = (value) => {
    const validation = validateSearchInput(value)
    if (validation.valid) {
      setSearchInput(value)
      setInputErrors(validation.error)
    } else {
      setInputErrors(validation.error)
    }
  }

  const handleCartDisplay = useCallback((endpoint) => {
    switch (endpoint) {
      case endpoints.CHECKOUT_ORD:
        setShowCart(false)
        break;
      case endpoints.CHECKOUT_REORD:
        setShowCart(false)
        break
      default:
        setShowCart(true)
        break;
    }
  }, [])

  useEffect(() => {
    if (token && userLocal) {
      setActiveSesion(true)
    }

    handleCartDisplay(endpoint)

    const expiredSesionHandler = () => {
      setActiveSesion(false)
      dispatch(LOGOUT())
    }
    eventBus.on('expired-sesion', expiredSesionHandler)
console.log(token)
    // const unsubscribe = firebaseAuth.onIdTokenChanged(async (user) => {
    //   console.log('aca', user)
    //   if (user) {
    //     const newToken = await user.getIdToken()
    //     localStorage.setItem('token', newToken)
    //   } else {
    //     localStorage.removeItem('token')
    //   }
    // })

    if (!token) {
      setModalAddress(false)
    }

    return () => {
      eventBus.off('expired-sesion', expiredSesionHandler)
      // unsubscribe()
    }
  }, [token, userLocal, modalLogin, modalRegister, userReducer, dispatch, endpoint, handleCartDisplay])

  return (
    <>
      <nav className='nav'>
        <div className='logo-nav'>
          <Link to={'/'}>
            <AdvancedImage cldImg={cloudinaryImg(LOGO_PUBLIC_ID)} alt='Logo' />
          </Link>
          <p>Pets Zone</p>
          <div className="search-bar">
            {
              window.innerWidth > 768 ?
                <div className='div-search'>
                  <Form.Control
                    className='input-search'
                    type="text"
                    placeholder='Buscar...'
                    ref={inputRef}
                    onKeyDown={handleKeyDown}
                    value={searchInput}
                    maxLength={35}
                    onChange={(e) => validateInput(e.target.value)} />
                  <MdSearch className='action-search-icon' size={25} onClick={() => handleSearchInput(inputRef.current.value)} />
                </div>
                :
                <Dropdown className="d-inline_mx-2">
                  <Dropdown.Toggle id="dropdown-autoclose-true" className='dropdown-custom-search'>
                    <MdSearch className='icon-search' size={20} />
                  </Dropdown.Toggle>
                  <Dropdown.Menu className='dropdown-custom-menu'>
                    <Dropdown.Item className='dropdown-search-item' onClick={(e) => e.stopPropagation()}>
                      <Form.Control className='input-search' type="text" placeholder='Buscar...' ref={inputRef} value={searchInput} onKeyDown={handleKeyDown} />
                      <MdSearch className='action-search-icon' size={20} onClick={() => handleSearchInput(inputRef.current.value)} />
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
            }
            {
              inputErrors?.length > 0 && <span>{inputErrors}</span>
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
                <FiLogIn className='icon-nav' size={20} onClick={handleLogin} />
              </div>
          }
          {
            showCart &&
            <LazyComponent>
              <Cart
                onHideLogin={() => setModalLogin(!modalLogin)}
              />
            </LazyComponent>
          }
        </div>
      </nav>
      {modalLogin && (
        <LazyComponent>
          <Login
            show={modalLogin}
            onHideLogin={() => setModalLogin(!modalLogin)}
            onHideRegister={() => setModalRegister(!modalRegister)}
          />
        </LazyComponent>
      )}

      {modalRegister && (
        <LazyComponent>
          <Register
            show={modalRegister}
            onHideLogin={() => setModalLogin(!modalLogin)}
            onHideRegister={() => setModalRegister(!modalRegister)}
          />
        </LazyComponent>
      )}

      {modalAddress && (
        <LazyComponent>
          <Address
            show={modalAddress}
            onHideAddress={() => setModalAddress(!modalAddress)}
            updateAddress={() => setAddressUpdated(!addressUpdated)}
            fromCheckout={false}
          />
        </LazyComponent>
      )}
    </>
  )
}