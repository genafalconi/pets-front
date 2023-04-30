import { GoogleMap, useLoadScript, Circle } from '@react-google-maps/api';
import { useMemo } from 'react';
import { Modal, Spinner } from 'react-bootstrap';

const libraries = ['places'];

export default function GoogleMaps({ show, handleHide }) {

  const center = useMemo(() => ({ lat: -34.439251576394, lng: -58.59573492482023 }), []);
  const valid_radius = 8000;

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_API_KEY,
    libraries: libraries
  });

  return (
    <Modal
      show={show}
      onHide={handleHide}
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter" >
          Nuestra Cobertura
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className='modal-maps-body'>
        {loadError ? (
          <div>Error loading maps</div>
        ) : isLoaded ? (
          <GoogleMap
            mapContainerClassName="maps-google"
            mapContainerStyle={{ height: '300px' }}
            center={center}
            zoom={11}
            options={{
              fullscreenControl: false,
              zoomControl: false,
              streetViewControl: false,
              gestureHandling: 'none',
              mapTypeControl: false,
            }}
          >
            <Circle center={center} radius={valid_radius} />
          </GoogleMap>
        ) : (
          <Spinner as="span" animation="border" size="md" role="status" aria-hidden="true" />
        )}
      </Modal.Body>
    </Modal>
  );
}
