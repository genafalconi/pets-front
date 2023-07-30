import Card from 'react-bootstrap/Card';
import { useNavigate } from 'react-router-dom';
import '../../styles/components/landing.scss'
import { AdvancedImage } from '@cloudinary/react';
import { cloudinaryImg } from '../../helpers/cloudinary';
import { AnimalDto } from '../../helpers/constants';

const CAT_PUBLIC_ID = 'Ppales/Cat'
const DOG_PUBLIC_ID = 'Ppales/Dog'

export default function AnimalCards() {

  const navigate = useNavigate()

  const handleAnimalSelected = (animal) => {
    navigate(`/products?animal=${animal}`)
  }

  return (
    <div className='animal-selection'>
      <Card className="bg-dark text-white animal-card" onClick={() => handleAnimalSelected(AnimalDto.CAT)}>
        <AdvancedImage cldImg={cloudinaryImg(CAT_PUBLIC_ID)} alt='Cat' />
        <Card.ImgOverlay>
          <div className="card-title-container cat">
            <Card.Title>Gato</Card.Title>
          </div>
        </Card.ImgOverlay>
      </Card>
      <Card className="bg-dark text-white animal-card" onClick={() => handleAnimalSelected(AnimalDto.DOG)}>
        <AdvancedImage cldImg={cloudinaryImg(DOG_PUBLIC_ID)} alt='Dog' />
        <Card.ImgOverlay>
          <div className="card-title-container dog">
            <Card.Title>Perro</Card.Title>
          </div>
        </Card.ImgOverlay>
      </Card>
    </div>
  );
}