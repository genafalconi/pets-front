// import { useCallback, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { GET_LANDING_IMAGES } from "../../redux/actions";
import { carouelImages } from "../../helpers/constants";
import { Carousel } from "react-bootstrap";
import ImageItem from "../atomic/ImageItem";
import '../../styles/components/landing.scss';
import '../../styles/components/dog-animation.scss';

export default function ImageCarousel({ isLoadingHighlight }) {

  // const dispatch = useDispatch();
  // const { carousel } = useSelector((state) => state.clientReducer);

  // const getLandingImages = useCallback(() => {
  //   if(Array.isArray(carousel)) {
  //     if (carousel.length === 0) {
  //       dispatch(GET_LANDING_IMAGES('CAROUSEL'))
  //     }
  //   }
  //   // eslint-disable-next-line
  // }, [dispatch])

  // useEffect(() => {
  //   getLandingImages()
  // }, [getLandingImages])

  return (
    <>
      {
        !isLoadingHighlight && (
          <Carousel className="img-carousel">
            {
              carouelImages.map((elem) => {
                return (
                  <Carousel.Item key={elem.name} className="carousel-item">
                    <ImageItem name={elem.name ? elem.name : '-'} img={elem.img} />
                    <Carousel.Caption>
                      <h3>{elem.text ? elem.text : '-'}</h3>
                    </Carousel.Caption>
                  </Carousel.Item>
                )
              })
            }
          </Carousel>
        )
      }
    </>
  );
}