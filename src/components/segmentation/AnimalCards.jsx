import Card from 'react-bootstrap/Card';
import { useNavigate, Link } from 'react-router-dom';
import dog from '../../beautiful-pet-portrait-dog.jpg'
import cat from '../../gold-bengal-cat-black-space.jpg'
import '../../styles/components/landing.scss'

export default function AnimalCards() {

  const navigate = useNavigate()

  const handleClick = (event) => {
    console.log(event)
    if (event.target.id === 'dog') {
      console.log('dog')
      // navigate('/products')
    } else {
      console.log('cat')
      // navigate('/products')
    }
  }

  return (
    <div className='animal-selection'>
      <Link to={'/products?animal=CAT'}>
        <Card className="bg-dark text-white animal-card">
          <Card.Img src={cat} alt="Card image" />
          <Card.ImgOverlay>
            <div className="card-title-container cat">
              <Card.Title>Gato</Card.Title>
            </div>
          </Card.ImgOverlay>
        </Card>
      </Link>
      <Link to={'/products?animal=DOG'}>
        <Card className="bg-dark text-white animal-card">
          <Card.Img src={dog} alt="Card image" />
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