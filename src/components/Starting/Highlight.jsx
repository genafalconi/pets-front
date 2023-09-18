import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GET_HIGHLIGHT_SUBPRODS } from "../../redux/actions";
import { Carousel } from "react-bootstrap";
import '../../styles/components/landing.scss';
import DogAnimation from "../atomic/DogAnimation";
import HighlightCard from "./HighlightCard";

export default function Highlights({ setIsLoadingHighlight }) {
  const dispatch = useDispatch();
  const { highlights } = useSelector((state) => state.clientReducer);

  const [isLoading, setIsLoading] = useState(true);

  let itemsPerLine = 4;

  if (window.matchMedia("(max-width: 900px) and (min-width: 500px)").matches) {
    itemsPerLine = 3;
  } else if (window.matchMedia("(max-width: 500px) and (min-width: 400px)").matches) {
    itemsPerLine = 2;
  } else if (window.matchMedia("(max-width: 400px)").matches) {
    itemsPerLine = 1;
  } else {
    itemsPerLine = 4;
  }

  const getHighlightProds = useCallback(() => {
    if (Array.isArray(highlights)) {
      if (highlights.length === 0) {
        dispatch(GET_HIGHLIGHT_SUBPRODS()).then((res) => {
          setIsLoading(false)
          setIsLoadingHighlight(false)
        });
      } else {
        setIsLoading(false);
        setIsLoadingHighlight(false);
      }
    }
    // eslint-disable-next-line
  }, [dispatch, setIsLoadingHighlight])

  useEffect(() => {
    getHighlightProds()
  }, [getHighlightProds]);

  const chunkHighlights = (arr, size) => {
    const chunkedArr = [];
    for (let i = 0; i < arr.length; i += size) {
      chunkedArr.push(arr.slice(i, i + size));
    }
    return chunkedArr;
  };

  return (
    <>
      {
        isLoading ? (
          <DogAnimation />
        ) : (
          <div className="highlight-container">
            <div className="subtitle d-flex justify-content-center">
              <h2>Ofertas</h2>
            </div>
            <Carousel className="custom-carousel">
              {
                chunkHighlights(highlights, itemsPerLine).map((chunk, index) => (
                  <Carousel.Item key={index}>
                    <div className="d-flex justify-content-center">
                      {chunk.map((elem, innerIndex) => (
                        <HighlightCard
                          item={elem}
                          index={innerIndex}
                          key={innerIndex}
                        />
                      ))}
                    </div>
                  </Carousel.Item>
                ))
              }
            </Carousel>
          </div>
        )
      }
      <br />
    </>
  );
}