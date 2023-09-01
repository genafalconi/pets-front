import { Carousel, Spinner } from "react-bootstrap";
import ImageItem from "../atomic/ImageItem";
import { useEffect, useState } from "react";
import '../../styles/components/landing.scss';
import { useDispatch, useSelector } from "react-redux";
import { GET_LANDING_IMAGES } from "../../redux/actions";

export default function ImageCarousel() {

  const dispatch = useDispatch();
  const { carousel } = useSelector((state) => state.clientReducer);
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    dispatch(GET_LANDING_IMAGES('CAROUSEL')).then((res) => {
      if (res.payload) {
        setIsLoading(false)
      }
    })
  }, [dispatch])

  return (
    <Carousel>
      {
        isLoading ? (
          <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
        ) : (
          carousel.map((elem) => {
            return (
              <Carousel.Item key={elem._id} className="carousel-item">
                <ImageItem name={elem.name ? elem.name : '-'} img={elem.image} />
                <Carousel.Caption>
                  <h3>{elem.text ? elem.text : '-'}</h3>
                </Carousel.Caption>
              </Carousel.Item>
            )
          })
        )
      }
    </Carousel>
  );
}