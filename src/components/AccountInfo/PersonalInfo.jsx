import { useEffect, useMemo, useState } from 'react';
import Card from 'react-bootstrap/Card';
import Placeholder from 'react-bootstrap/Placeholder';
import { useDispatch } from 'react-redux';
import { GET_ACCOUNT_INFO } from '../../redux/actions';
import '../../styles/components/account.scss'
import { Button } from 'react-bootstrap';
import ResetPassword from '../atomic/ResetPassword';

export default function PersonalInfo() {

  const dispatch = useDispatch()
  const [personalInfo, setPersonalInfo] = useState(null)
  const [modalReset, setModalReset] = useState(false)
  const user = useMemo(() => localStorage.getItem('user'), []);

  const resetPassword = () => {
    setModalReset(true)
  }

  useEffect(() => {
    dispatch(GET_ACCOUNT_INFO(user))
      .then((res) => {
        if (res.payload) {
          setPersonalInfo(res.payload)
        }
      })
  }, [dispatch, user])

  return (
    <>
      {
        personalInfo ? (
          <Card className='personal-card'>
            <Card.Body>
              <Card.Title>Informacion personal</Card.Title>
              <Card.Text>
                <span>E-mail: {personalInfo?.email}</span>
                <span>Nombre y apellido: {personalInfo?.full_name}</span>
                <span>Telefono: {personalInfo?.phone ? personalInfo?.phone : '-'}</span>
              </Card.Text>
            </Card.Body>
            <Card.Footer>
              <Button variant='link' onClick={resetPassword}>Cambiar contraseña</Button>
            </Card.Footer>
          </Card>
        ) : (
          <Card className='personal-card'>
            <Card.Body>
              <Card.Title>Informacion personal</Card.Title>
              <Placeholder as={Card.Text} animation="glow">
                <Placeholder xs={6} />
                <Placeholder xs={6} />
                <Placeholder xs={6} />
              </Placeholder>
            </Card.Body>
          </Card>
        )
      }
      <ResetPassword
        show={modalReset}
        onHideReset={() => setModalReset(!modalReset)}
      />
    </>
  )
}