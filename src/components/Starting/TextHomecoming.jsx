import { Card } from 'react-bootstrap';
import '../../styles/components/landing.scss';

export default function TextHomecoming() {
  return (
    <Card>
      <Card.Body>
        <Card.Title>Bienvenido a Pet's Zone</Card.Title>
        <div className="data-text">
          <p>En <span className="highlight">Pet's Zone</span>, pueden disfrutar su nueva forma de organizar y hacer sus pedidos.</p>
          <ul>
            <li>Con ya 3 años, evolucionamos la manera de realizar pedidos.</li>
            <li>Para generar confianza a nuestros clientes, el pago por tu pedido se realiza <strong>UNICAMENTE</strong> cuando se recibe y comprobas el buen estado del mismo.</li>
            <li>Contamos con servicio en: Tigre, San Fernando, Nordelta, Pacheco, Benavidez y más.</li>
            <li>Por cualquier inconveniente o problema, contáctate con los dueños: 1138312454, Genaro.</li>
          </ul>
        </div>
      </Card.Body>
    </Card>
  );
}
