import '../../styles/components/nav.scss'
import { FiUserX } from 'react-icons/fi'
import { MdSearch } from 'react-icons/md'
import { RxCrossCircled } from 'react-icons/rx'
import Form from 'react-bootstrap/Form';
import { useCallback, useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Login from '../UserSesion/Login'
import UserOptions from '../UserSesion/UserOptions'
import Register from '../UserSesion/Register'
import Cart from './Cart'
import Address from '../Orders/Address'
import { useDispatch, useSelector } from 'react-redux'
import { LOGOUT, SET_INPUT_SEARCH, VERIFY_TOKEN } from '../../redux/actions'
import eventBus from '../../helpers/event-bus'
import { AdvancedImage } from '@cloudinary/react'
import { cloudinaryImg } from '../../helpers/cloudinary'
import LazyComponent from '../../helpers/lazyComponents'
import { endpoints } from '../../helpers/constants';
import { validateSearchInput } from '../../helpers/validateInputs';
import '../../styles/components/nav.scss';

const LOGO_PUBLIC_ID = 'Ppales/croplogo_ikxgit'

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
  const [showCross, setShowCross] = useState(false)
  const inputRef = useRef('')

  const input = new URLSearchParams(useLocation().search).get("input");
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
    dispatch(SET_INPUT_SEARCH(value)).then(() => {
      navigate(`/products${query}`);
    })
  }

  const handleCrossInput = () => {
    setShowCross(false)
    inputRef.current.value = ''
    setSearchInput('');
    dispatch(SET_INPUT_SEARCH(''));
    const baseUrl = window.location.href.split('?')[0];
    window.history.replaceState({}, document.title, baseUrl);
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      dispatch(SET_INPUT_SEARCH(e?.target?.value));
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
    setShowCross(true)
  }

  const handleFiltersClick = (event) => {
    navigate(event.target.id)
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

    if (input && input.length !== 0) {
      setSearchInput(input)
      setShowCross(true)
    }

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
  }, [token, userLocal, modalLogin, modalRegister, userReducer, dispatch, endpoint, handleCartDisplay, handleFilters, input])

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
                value={searchInput ? searchInput : ''}
                maxLength={35}
                onChange={(e) => { validateInput(e.target.value) }}
              />
              <div className='action-search-icon'>
                {window.innerWidth > 768 && (
                  <>
                    <MdSearch size={25} onClick={() => handleSearchInput(inputRef.current.value)} />
                    {showCross && (
                      <RxCrossCircled className='action-delete-icon' size={25}
                        onClick={handleCrossInput}
                      />
                    )}
                  </>
                )}
              </div>

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
          <p id={'/products'} onClick={handleFiltersClick}>Productos</p>
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