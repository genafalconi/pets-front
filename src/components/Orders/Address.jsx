import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import Modal from 'react-bootstrap/Modal';
import '../../styles/modals/modalAddress.scss';
import { CREATE_USER_ADDRESS, GET_USER_ADDRESS } from '../../redux/actions';
import AddressList from './AddressList';

export default function Address({ show, onHideAddress }) {

  const dispatch = useDispatch()
  const addresses = useSelector((state) => state.clientReducer.address)

  const [isLoading, setIsLoading] = useState(false)
  const [address, setAddress] = useState({
    street: '',
    number: 0,
    floor: '',
    flat: '',
    city: '',
    province: '',
    extra: ''
  })

  const handleChange = (event) => {
    setAddress({
      ...address,
      [event.target.name]: event.target.value
    })
  }

  const getUserAddresses = async () => {
    setIsLoading(true)
    if (show) {
      dispatch(GET_USER_ADDRESS()).then((res) => {
        if (res.payload) {
          setIsLoading(false)
        }
      })
    }
  }

  const handleCreateAddress = () => {
    setIsLoading(true)
    dispatch(CREATE_USER_ADDRESS(address)).then((res) => {
      if (Object.keys(res.payload).length !== 0) {
        setIsLoading(false)
        onHideAddress()
      }
    })
  }

  useEffect(() => {
    if (show) {
      getUserAddresses()
    }
    // eslint-disable-next-line
  }, [dispatch, show])

  return (
    <Modal
      show={show}
      onHide={onHideAddress}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      className='modal-address'
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter" >
          Direcciones
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className='modal-address-body'>
        {
          addresses?.length > 0 ?
            addresses?.map((elem) => {
              return <AddressList id={elem.id} modal={true} key={elem.id} street={elem.street} number={elem.number} floor={elem.floor} flat={elem.flat}
                city={elem.city} province={elem.province} extra={elem.extra} />
            })
            : ''
        }
        <form className='modal-body_form'>
          <div className='grid-container'>
            <div className='grid-item'>
              <label>Calle:</label>
              <input type='text' name='street' onChange={handleChange} />
            </div>
            <div className='grid-item'>
              <label>Numero:</label>
              <input type='text' name='number' onChange={handleChange} />
            </div>
            <div className='grid-item'>
              <label>Piso:</label>
              <input type='text' name='floor' onChange={handleChange} />
            </div>
            <div className='grid-item'>
              <label>Departamento:</label>
              <input type='text' name='flat' onChange={handleChange} />
            </div>
            <div className='grid-item'>
              <label>Ciudad:</label>
              <input type='text' name='city' onChange={handleChange} />
            </div>
            <div className='grid-item'>
              <label>Provincia:</label>
              <input type='text' name='province' onChange={handleChange} />
            </div>
            <div className='grid-item'>
              <label>Comentarios:</label>
              <input type='text' name='extra' onChange={handleChange} />
            </div>
          </div>
        </form>
        {
          isLoading ?
            <Button className='modal-body_address'>
              <Spinner as="span" animation="border" size='sm' role="status" aria-hidden="true" />
            </Button>
            :
            <div className="primary-button">
              <Button className='modal-body_address' onClick={handleCreateAddress}>Crear</Button>
            </div>
        }
      </Modal.Body>
    </Modal>
  )
}