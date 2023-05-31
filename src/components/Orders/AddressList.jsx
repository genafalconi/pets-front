import { useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
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
  const [isSelected, setIsSelected] = useState(selectedAddress === id);

  const handleSelectedAddress = () => {
    setSelectedAddress((prevSelected) => (prevSelected === id ? null : id));
    setSettedAddress((prevSelected) => (prevSelected === id ? null : id));
  };


  const handleCheckboxChange = (e) => {
    const { checked } = e.target;
    setIsSelected(checked);
    setSelectedAddress(checked ? id : null);
    setSettedAddress(checked ? id : null);
  };

  useEffect(() => {
    setIsSelected(selectedAddress === id);
  }, [selectedAddress, id]);

  return (
    <div
      className={modal ? 'container-address-modal' : `container-address ${isSelected ? 'selected' : ''}`}
      onClick={!modal ? handleSelectedAddress : undefined}
    >
      {!modal && <Form.Check aria-label="address" key={id} checked={isSelected} onChange={handleCheckboxChange} />}
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
        <div className="extra d-flex">
          <p>Comentarios: {extra}</p>
        </div>
      </div>
    </div>
  );
}
