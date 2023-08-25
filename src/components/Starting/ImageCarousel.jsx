import { Carousel } from "react-bootstrap";
import ImageItem from "../atomic/ImageItem";
import { useEffect } from "react";
import { carouelImages } from "../../helpers/constants";
import '../../styles/components/landing.scss';

export default function ImageCarousel() {


  useEffect(() => {

  }, [])

  return (
    <Carousel>
      {
        carouelImages.map((elem) => {
          return (
            <Carousel.Item key={elem.name} className="carousel-item">
              <ImageItem name={elem.name} img={elem.img} />
              <Carousel.Caption>
                <h3>{elem.text}</h3>
              </Carousel.Caption>
            </Carousel.Item>
          )
        })
      }
    </Carousel>
  );
}