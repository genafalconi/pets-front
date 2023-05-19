import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';
import '../../styles/components/landing.scss'
import { AdvancedImage } from '@cloudinary/react';
import { cloudinaryImg } from '../../helpers/cloudinary';

const CAT_PUBLIC_ID = 'Ppales/Cat'
const DOG_PUBLIC_ID = 'Ppales/Dog'

export default function AnimalCards() {

  return (
    <div className='animal-selection'>
      <Link to={'/products?animal=CAT'}>
        <Card className="bg-dark text-white animal-card">
          <AdvancedImage cldImg={cloudinaryImg(CAT_PUBLIC_ID)} alt='Cat' />
          <Card.ImgOverlay>
            <div className="card-title-container cat">
              <Card.Title>Gato</Card.Title>
            </div>
          </Card.ImgOverlay>
        </Card>
      </Link>
      <Link to={'/products?animal=DOG'}>
        <Card className="bg-dark text-white animal-card">
          <AdvancedImage cldImg={cloudinaryImg(DOG_PUBLIC_ID)} alt='Cat' />
          <Card.ImgOverlay>
            <div className="card-title-container dog">
              <Card.Title>Perro</Card.Title>
            </div>
          </Card.ImgOverlay>
        </Card>
      </Link>
    </div>
  );
}