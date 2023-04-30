import { useEffect } from 'react';
import '../../styles/components/checkout.scss';

export default function AddressList({
  id,
  modal,
  street,
  number,
  floor,
  flat,
  city,
  province,
  extra,
  setSettedAddress,
  selectedAddress,
  setSelectedAddress,
}) {
  const handleSelectedAddress = (address) => {
    if (selectedAddress === address) {
      setSelectedAddress(null);
      setSettedAddress(null);
    } else {
      setSelectedAddress(address);
      setSettedAddress(address);
    }
  };

  useEffect(() => { }, [selectedAddress]);

  return (
    <div className={modal ? 'container-address-modal' : `container-address ${selectedAddress === id ? 'selected' : ''}`} onClick={() => handleSelectedAddress(id)}>
      <div className="address-list-container">
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
          <p>Comentarios: {extra}</p>
        </div>
      </div>
    </div>
  );
}
