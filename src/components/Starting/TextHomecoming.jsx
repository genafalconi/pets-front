import { Card } from 'react-bootstrap';
import '../../styles/components/landing.scss';

export default function TextHomecoming() {
  return (
    <Card>
      <Card.Body>
        <Card.Title>Bienvenido a Pet's Zone</Card.Title>
        <div className="data-text">
          <ul>
            <li><span>Evolucionamos</span> la manera de realizar pedidos.</li>
            <li>Tu pago se realiza <span>unicamente</span> cuando recibis el pedido.</li>
          </ul>
        </div>
      </Card.Body>
    </Card>
  );
}
