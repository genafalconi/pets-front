import { useCallback, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { DELETE_USER_ADDRESS, GET_USER_ADDRESS } from "../../redux/actions"
import LazyComponent from "../../helpers/lazyComponents"
import { MdOutlineDelete, MdOutlineEdit } from "react-icons/md"
import { Card, Placeholder } from "react-bootstrap"
import '../../styles/components/account.scss';
import Address from "../Orders/Address"

export default function UserAddresses() {

  const dispatch = useDispatch()
  const { addresses } = useSelector((state) => state.clientReducer)
  const [isLoading, setIsLoading] = useState(false)
  const [modalAddress, setModalAddress] = useState(false)
  const [editAddress, setEditAddress] = useState({
    id: '',
    street: '',
    number: 0,
    floor: '',
    flat: '',
    city: '',
    province: '',
    extra: ''
  })

  const getUserAddresses = useCallback(() => {
    setIsLoading(true)
    dispatch(GET_USER_ADDRESS()).then((res) => {
      if (res.payload) {
        setIsLoading(false)
      }
    })
  }, [dispatch])

  const handleEditAddress = useCallback((address) => {
    setEditAddress({
      id: address._id,
      street: address.street,
      number: address.number,
      floor: address.floor,
      flat: address.flat,
      city: address.city,
      province: address.province,
      extra: address.extra
    })
    setModalAddress(true)
  }, [])

  const handleDeleteAddress = useCallback((address_id) => {
    dispatch(DELETE_USER_ADDRESS(address_id))
  }, [dispatch])

  useEffect(() => {
    getUserAddresses()
  }, [getUserAddresses])

  return (
    <>
      <Card className='personal-card'>
        <Card.Body>
          <Card.Title>Direcciones</Card.Title>
          {
            isLoading ? (
              <Placeholder as={Card} animation="glow" className='accordion-orders'>
                <Placeholder as={Card.Body} animation='glow' >
                  <Placeholder xs={11} />
                </Placeholder>
                <Placeholder as={Card.Body} animation='glow' >
                  <Placeholder xs={11} />
                </Placeholder>
              </Placeholder>
            ) : (
              <>
                {
                  Array.isArray(addresses) &&
                  addresses.map((elem) => {
                    return (
                      <LazyComponent key={elem._id}>
                        <div className='account-address-item'>
                          <div className='address-item_title'>
                            <h5 className='m-0'>{elem.street} {elem.number}</h5>
                            <div className="actions">
                              <MdOutlineDelete className='address-item_action' onClick={() => handleDeleteAddress(elem._id)} />
                              <MdOutlineEdit className="address-item_action" onClick={() => handleEditAddress(elem)} />
                            </div>
                          </div>
                          <div className='account-item_details'>
                            <div className="row">
                              <div className="col">
                                <p>Piso: {elem.floor ? elem.floor : '-'} </p>
                                <p>Departamento: {elem.flat ? elem.flat : '-'} </p>
                              </div>
                              <div className="col">
                                <p>Ciudad: {elem.city} </p>
                                <p>Provincia: {elem.province}</p>
                              </div>
                            </div>
                            <div className="account-address-extra">
                              <p>Extra: {elem.extra ? elem.extra : '-'}</p>
                            </div>
                          </div>
                        </div>
                      </LazyComponent>
                    )
                  })
                }
              </>
            )
          }
        </Card.Body>
      </Card>
      {modalAddress && (
        <LazyComponent>
          <Address
            show={modalAddress}
            onHideAddress={() => setModalAddress(!modalAddress)}
            updateAddress={null}
            fromCheckout={false}
            editAddress={editAddress}
          />
        </LazyComponent>
      )}
    </>
  )
}