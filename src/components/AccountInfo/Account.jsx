import ListGroup from 'react-bootstrap/ListGroup';
import PersonalInfo from './PersonalInfo';
import UserOrders from './UserOrders';
import Settings from './Settings';
import { useState } from 'react';
import '../../styles/components/account.scss'

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
          <ListGroup defaultActiveKey="index">
            <ListGroup.Item id='info' action onClick={displayInfoById}>
              Informacion personal
            </ListGroup.Item>
            <ListGroup.Item id='orders' action onClick={displayInfoById}>
              Mis pedidos
            </ListGroup.Item>
            {/* <ListGroup.Item id='setting' action onClick={displayInfoById}>
              Configuracion
            </ListGroup.Item> */}
          </ListGroup>
        </div>
        <div className="item-selected">
          {selectedItemId === 'info' && <PersonalInfo />}
          {selectedItemId === 'orders' && <UserOrders />}
          {selectedItemId === 'setting' && <Settings />}
        </div>
      </div>
    </div>
  )
}