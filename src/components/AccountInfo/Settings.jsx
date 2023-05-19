import Card from 'react-bootstrap/Card';
import Placeholder from 'react-bootstrap/Placeholder';

export default function Settings() {
  return (
    <>
      <Card className='personal-card'>
        <Card.Body>
          <Card.Title>Configuracion</Card.Title>
          {
            // (
            //   <h1>hola</h1>
            // ) : (
              <Placeholder as={Card.Body} animation="glow" className='accordion-orders'>
                <Placeholder as={Card.Text} animation='glow' >
                  <Placeholder xs={11} />
                </Placeholder>
                <Placeholder as={Card.Text} animation='glow' >
                  <Placeholder xs={11} />
                </Placeholder>
              </Placeholder>
            // )
          }
        </Card.Body >
      </Card >
    </>
  )
}