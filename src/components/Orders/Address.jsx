import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import Modal from 'react-bootstrap/Modal';
import '../../styles/modals/modalAddress.scss';
import { CREATE_USER_ADDRESS, UPDATE_USER_ADDRESS } from '../../redux/actions';
import GoogleMaps from '../atomic/GoogleMaps';
import Form from 'react-bootstrap/Form';
import { Col, Row } from 'react-bootstrap';
import LazyComponent from '../../helpers/lazyComponents';

export default function Address({ show, onHideAddress, updateAddress, fromCheckout, editAddress }) {

  const dispatch = useDispatch()

  const [searchByMaps, setSearchByMaps] = useState(false)
  const [isLoadingButton, setIsLoadingButton] = useState(false)
  const [address, setAddress] = useState({
    id: '',
    street: '',
    number: '',
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

  const validateInputs = useCallback(() => {
    if (address.street.length !== 0) return true
  }, [address.street.length])

  const handleSearchMaps = () => {
    setSearchByMaps(!searchByMaps)
  }

  const handleCreateAddress = useCallback(() => {
    const validation = validateInputs()
    if (validation) {
      setIsLoadingButton(true)
      dispatch(CREATE_USER_ADDRESS(address)).then((res) => {
        if (Object.keys(res.payload).length !== 0) {
          setIsLoadingButton(false)
          if (updateAddress) updateAddress()
          if (fromCheckout) {
            onHideAddress()
          }
        }
      })
    }
  }, [dispatch, address, fromCheckout, onHideAddress, updateAddress, validateInputs])

  const handleEditAddress = useCallback(() => {
    const validation = validateInputs()
    if (validation) {
      setIsLoadingButton(true)
      dispatch(UPDATE_USER_ADDRESS(address)).then((res) => {
        if (Object.keys(res.payload).length !== 0) {
          setIsLoadingButton(false)
          onHideAddress()
        }
      })
    }
  }, [dispatch, address, onHideAddress, validateInputs])

  useEffect(() => {
    if (editAddress) {
      setAddress({
        id: editAddress.id || '',
        street: editAddress.street || '',
        number: editAddress.number || '',
        floor: editAddress.floor || '',
        flat: editAddress.flat || '',
        city: editAddress.city || '',
        province: editAddress.province || '',
        extra: editAddress.extra || ''
      });
    }
  }, [editAddress])

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
        <Form className='modal-body_form-address'>
          <Row>
            <Col>
              <Form.Group className="mb-3" controlId="formBasicStreet">
                <Form.Label>Calle:</Form.Label>
                <Form.Control name='street' type="text" defaultValue={address.street} onChange={handleChange} />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className="mb-3" controlId="formBasicNro">
                <Form.Label>Numero</Form.Label>
                <Form.Control name='number' type="text" defaultValue={address.number} onChange={handleChange} />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group className="mb-3" controlId="formBasicFloor">
                <Form.Label>Piso</Form.Label>
                <Form.Control name='floor' type="text" placeholder="Nro" defaultValue={address.floor} onChange={handleChange} />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className="mb-3" controlId="formBasicFlat">
                <Form.Label>Departamento</Form.Label>
                <Form.Control name='flat' type="text" placeholder="Nro" defaultValue={address.flat} onChange={handleChange} />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group className="mb-3" controlId="formBasicCity">
                <Form.Label>Ciudad</Form.Label>
                <Form.Control name='city' type="text" defaultValue={address.city} onChange={handleChange} />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className="mb-3" controlId="formBasicProvince">
                <Form.Label>Provincia</Form.Label>
                <Form.Control name='province' type="text" defaultValue={address.province} onChange={handleChange} />
              </Form.Group>
            </Col>
            <Col>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group className="mb-3" controlId="formBasicExtra">
                <Form.Label>Comentarios</Form.Label>
                <Form.Control name='extra' type="text" defaultValue={address.extra} onChange={handleChange} />
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
                <Button className='w-25' onClick={editAddress ? handleEditAddress : handleCreateAddress}>Crear</Button>
              </div>
          }
        </Form>
        <div>
          <Button variant='link' onClick={handleSearchMaps}>
            Mira nuestra zona de cobertura
          </Button>
          {
            searchByMaps ?
              <LazyComponent>
                <GoogleMaps
                  show={searchByMaps}
                  handleHide={() => setSearchByMaps(!searchByMaps)}
                />
              </LazyComponent>
              : ''
          }
        </div>
      </Modal.Body>
    </Modal>
  )
}