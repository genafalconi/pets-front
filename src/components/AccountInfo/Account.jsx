import ListGroup from 'react-bootstrap/ListGroup';
import PersonalInfo from './PersonalInfo';
import Settings from './Settings';
import { useState } from 'react';
import '../../styles/components/account.scss'
import UserAddresses from './UserAddresses';

export default function Account() {

  const [selectedItemId, setSelectedItemId] = useState('info');

  const displayInfoById = (event) => {
    setSelectedItemId(event.target.id);
  }

  return (
    <div className="content-page">
      <div className="title">
        <h1>Cuenta</h1>
      </div>
      <div className="account-container">
        <div className="side-nav">
          <ListGroup defaultActiveKey="index" horizontal={window.innerWidth > 768 ? false : true}>
            <ListGroup.Item id='info' action onClick={displayInfoById}>
              Informacion personal
            </ListGroup.Item>
            <ListGroup.Item id='addresses' action onClick={displayInfoById}>
              Direcciones
            </ListGroup.Item>
            {/* <ListGroup.Item id='setting' action onClick={displayInfoById}>
              Configuracion
            </ListGroup.Item> */}
          </ListGroup>
        </div>
        <div className="item-selected">
          {selectedItemId === 'info' && <PersonalInfo />}
          {selectedItemId === 'addresses' && <UserAddresses />}
          {selectedItemId === 'setting' && <Settings />}
        </div>
      </div>
    </div>
  )
}