import '../../styles/components/nav.scss'
import { FiUserX } from 'react-icons/fi'
import { MdSearch } from 'react-icons/md'
import Form from 'react-bootstrap/Form';
import { useCallback, useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Login from '../UserSesion/Login'
import UserOptions from '../UserSesion/UserOptions'
import Register from '../UserSesion/Register'
import Cart from './Cart'
import Address from '../Orders/Address'
import { useDispatch, useSelector } from 'react-redux'
import { LOGOUT, VERIFY_TOKEN } from '../../redux/actions'
import eventBus from '../../helpers/event-bus'
import { AdvancedImage } from '@cloudinary/react'
import { cloudinaryImg } from '../../helpers/cloudinary'
import LazyComponent from '../../helpers/lazyComponents'
import { endpoints } from '../../helpers/constants';
import { validateSearchInput } from '../../helpers/validateInputs';
import '../../styles/components/nav.scss';

const LOGO_PUBLIC_ID = 'Ppales/Logo'

export default function Nav() {

  const [modalLogin, setModalLogin] = useState(false)
  const [activeSesion, setActiveSesion] = useState(false)
  const [modalRegister, setModalRegister] = useState(false)
  const [modalAddress, setModalAddress] = useState(false)
  const [addressUpdated, setAddressUpdated] = useState(false)
  const [showCart, setShowCart] = useState(true)
  const [showFilter, setShowFilter] = useState(true)
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

  const handleFilters = useCallback((endpoint) => {
    switch (endpoint) {
      case '/products':
        setShowFilter(true)
        break;
      case '/':
        setShowFilter(true)
        break;
      default:
        setShowFilter(false)
    }
  }, [])

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
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      dispatch(VERIFY_TOKEN()).then((res) => {
        if (res.payload) {
          setActiveSesion(true)
        } else {
          setActiveSesion(false)
          dispatch(LOGOUT())
        }
      })
    }
  }, [dispatch])

  useEffect(() => {
    handleCartDisplay(endpoint)
    handleFilters(endpoint)

    if (token && userReducer) {
      setActiveSesion(true)
    }

    const expiredSesionHandler = () => {
      setActiveSesion(false)
      dispatch(LOGOUT())
    }
    eventBus.on('expired-sesion', expiredSesionHandler)

    if (!token) {
      setModalAddress(false)
    }

    return () => {
      eventBus.off('expired-sesion', expiredSesionHandler)
    }
  }, [token, userLocal, modalLogin, modalRegister, userReducer, dispatch, endpoint, handleCartDisplay, handleFilters])

  return (
    <>
      <nav className='nav'>
        <div className='logo-nav' onClick={() => navigate('/')}>
          <AdvancedImage cldImg={cloudinaryImg(LOGO_PUBLIC_ID)} alt='Logo' />
          <p>Pets Zone</p>
        </div>
        <div className="nav-links">
          <div className="search-bar">
            <div className='div-search'>
              <Form.Control
                className='input-search'
                type="text"
                placeholder='Buscar...'
                ref={inputRef}
                onKeyDown={handleKeyDown}
                value={searchInput}
                maxLength={35}
                onChange={(e) => validateInput(e.target.value)}
              />
              {
                window.innerWidth > 768 &&
                  <MdSearch className='action-search-icon' size={25} onClick={() => handleSearchInput(inputRef.current.value)} />
              }
            </div>
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
                <FiUserX className='icon-nav' size={20} onClick={handleLogin} />
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
      {
        showFilter &&
        <nav className='nav filter'>
          <a href="/products">Productos</a>
          <a href="/products?animal=DOG">Perro</a>
          <a href="/products?animal=CAT">Gato</a>
        </nav>
      }
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