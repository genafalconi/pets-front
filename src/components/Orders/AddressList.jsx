import { useEffect } from 'react'
import { useState } from 'react'
import '../../styles/components/checkout.scss'

export default function AddressList({ id, modal, street, number, floor, flat, city, province, extra, setSettedAddress }) {

  const [selectedAddress, setSelectedAddress] = useState()

  const handleSelectedAddress = (address) => {
    if (selectedAddress === address) {
      // If the address is already selected, unselect it
      setSelectedAddress(null)
      setSettedAddress(null)
    } else {
      // Otherwise, select the clicked address
      setSelectedAddress(address)
      setSettedAddress(address)
    }
  }

  useEffect(() => {
  }, [selectedAddress]);

  return (
    <>
      <div className={modal ? "container-address-modal" : `container-address ${selectedAddress === id ? 'selected' : ''}`} onClick={() => handleSelectedAddress(id)}>
        <div className="address-details">
          <h5>{street}</h5>
          <h5>{number}</h5>
        </div>
        <div className="address-sec-details">
          <div className="col1">
            <p>Piso: {floor ? floor : '-'}</p>
            <p>Departamento: {flat ? flat : '-'}</p>
          </div>
          <div className="col2">
            <p>Ciudad: {city}</p>
            <p>Provincia: {province}</p>
          </div>
        </div>
        <div className="extra">
          <p>{extra}</p>
        </div>
      </div>
      {
        selectedAddress ? '' : <p>Selecciona una direccion</p>
      }
    </>
  )
}