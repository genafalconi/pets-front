import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import Modal from 'react-bootstrap/Modal';
import '../../styles/modals/modalAddress.scss';
import { CREATE_USER_ADDRESS, GET_USER_ADDRESS } from '../../redux/actions';
import GoogleMaps from '../atomic/GoogleMaps';
import AddressList from './AddressList';
import Form from 'react-bootstrap/Form';
import { Col, Row } from 'react-bootstrap';

export default function Address({ show, onHideAddress, updateAddress, fromCheckout }) {

  const dispatch = useDispatch()
  const addresses = useSelector((state) => state.clientReducer.addresses)

  const [searchByMaps, setSearchByMaps] = useState(false)
  const [isConfirmed, setIsConfirmed] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingButton, setIsLoadingButton] = useState(false)
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

  const getUserAddresses = async (isOpen) => {
    if (show || isOpen) {
      dispatch(GET_USER_ADDRESS()).then((res) => {
        if (res.payload) {
          setIsLoading(false)
        }
      })
    }
  }

  const validateInputs = () => {
    if (address.street.length !== 0) return true
  }

  const handleSearchMaps = () => {
    setSearchByMaps(!searchByMaps)
  }

  const handleCreateAddress = () => {
    const validation = validateInputs()
    if (validation) {
      setIsLoadingButton(true)
      setIsConfirmed(true)
      dispatch(CREATE_USER_ADDRESS(address)).then((res) => {
        if (Object.keys(res.payload).length !== 0) {
          setIsLoadingButton(false)
          updateAddress()
          if (fromCheckout) onHideAddress()
          setIsConfirmed(false)
        }
      })
    }
  }

  useEffect(() => {
    getUserAddresses()
    // eslint-disable-next-line
  }, [dispatch, show, updateAddress])

  return (
    <Modal
      show={show}
      onHide={onHideAddress}
      size='lg'
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
          isLoading ? ''
            :
            <div className='address-table-scroll'>
              <div className='address-table'>
                {
                  Array.isArray(addresses) &&
                  addresses.map((elem) => {
                    return (
                      <div key={elem._id} className='address-item'>
                        <AddressList key={elem._id} id={elem._id} modal={true} street={elem.street} number={elem.number}
                          floor={elem.floor} flat={elem.flat} city={elem.city} province={elem.province} extra={elem.extra}
                          setSettedAddress={null} selectedAddress={null} setSelectedAddress={null} />
                        <hr />
                      </div>
                    )
                  })
                }
              </div>
            </div>
        }
        <Form className='modal-body_form'>
          <Row>
            <Col>
              <Form.Group className="mb-3" controlId="formBasicStreet">
                <Form.Label>Calle:</Form.Label>
                <Form.Control name='street' type="text" onChange={handleChange} />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className="mb-3" controlId="formBasicNro">
                <Form.Label>Numero</Form.Label>
                <Form.Control name='number' type="text" onChange={handleChange} />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group className="mb-3" controlId="formBasicFloor">
                <Form.Label>Piso</Form.Label>
                <Form.Control name='floor' type="text" placeholder="Nro" onChange={handleChange} />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className="mb-3" controlId="formBasicFlat">
                <Form.Label>Departamento</Form.Label>
                <Form.Control name='flat' type="text" placeholder="Nro" onChange={handleChange} />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group className="mb-3" controlId="formBasicCity">
                <Form.Label>Ciudad</Form.Label>
                <Form.Control name='city' type="text" onChange={handleChange} />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className="mb-3" controlId="formBasicProvince">
                <Form.Label>Provincia</Form.Label>
                <Form.Control name='province' type="text" onChange={handleChange} />
              </Form.Group>
            </Col>
            <Col>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group className="mb-3" controlId="formBasicExtra">
                <Form.Label>Comentarios</Form.Label>
                <Form.Control name='extra' type="text" onChange={handleChange} />
              </Form.Group>
            </Col>
          </Row>
          {
            isLoadingButton ?
              <div className="d-flex justify-content-center">
                <Button className='modal-body_address'>
                  <Spinner as="span" animation="border" size='sm' role="status" aria-hidden="true" />
                </Button>
              </div>
              :
              <div className="d-flex justify-content-center">
                <Button className='w-25' onClick={isConfirmed ? null : handleCreateAddress}>Crear</Button>
              </div>
          }
        </Form>
        <div>
          <Button variant='link' onClick={handleSearchMaps}>
            Mira nuestra zona de cobertura
          </Button>
          {
            searchByMaps ?
              <GoogleMaps
                show={searchByMaps}
                handleHide={() => setSearchByMaps(!searchByMaps)}
              />
              : ''
          }
        </div>
      </Modal.Body>
    </Modal>
  )
}