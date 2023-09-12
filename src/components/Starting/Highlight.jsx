import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ADD_TO_CART, ADD_TO_LOCAL_CART, GET_HIGHLIGHT_SUBPRODS } from "../../redux/actions";
import { Button, Card, Carousel, Spinner } from "react-bootstrap";
import { cloudinaryImg } from "../../helpers/cloudinary";
import { AdvancedImage } from "@cloudinary/react";
import '../../styles/components/landing.scss';
import NewProd from "../Product/NewProd";

export default function Highlights() {
  const dispatch = useDispatch();
  const { highlights } = useSelector((state) => state.clientReducer);

  const [isLoading, setIsLoading] = useState(true);
  const [showNewProd, setShowNewProd] = useState(false);
  const [newProd, setNewProd] = useState(null);
  const user = localStorage.getItem('user')

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

  const addToCart = useCallback((data) => {
    const subprod = highlights.find((elem) => elem._id === data._id)
console.log(subprod)
    const subProdToAdd = {
      _id: subprod?._id,
      product: subprod?.product?._id,
      buy_price: subprod?.buy_price,
      sell_price: subprod?.sell_price,
      size: subprod?.size,
      stock: subprod?.stock,
      image: subprod?.product?.image,
      quantity: 1,
      name: subprod?.product?.name
    }
    setNewProd(subProdToAdd)
    setShowNewProd(true)

    dispatch(ADD_TO_LOCAL_CART(subProdToAdd))
    if (user) {
      setIsLoading(true);
      dispatch(ADD_TO_CART(subProdToAdd))
        .then(() => {
          setIsLoading(false);
          setShowNewProd(false);
        })
        .catch((error) => {
          setIsLoading(false);
          setShowNewProd(false);
        });
    }

  }, [dispatch, highlights, user])

  useEffect(() => {
    dispatch(GET_HIGHLIGHT_SUBPRODS()).then((res) => setIsLoading(false));
  }, [dispatch]);

  const chunkHighlights = (arr, size) => {
    const chunkedArr = [];
    for (let i = 0; i < arr.length; i += size) {
      chunkedArr.push(arr.slice(i, i + size));
    }
    return chunkedArr;
  };
  console.log(highlights)
  return (
    <div className="highlight-container">
      <div className="subtitle d-flex justify-content-center">
        <h2>Productos destacados</h2>
      </div>
      <Carousel className="custom-carousel">
        {!isLoading ? (
          chunkHighlights(highlights, itemsPerLine).map((chunk, index) => (
            <Carousel.Item key={index}>
              <div className="d-flex justify-content-center">
                {chunk.map((elem, innerIndex) => (
                  <Card key={innerIndex} className="highlight-card">
                    <div className="highlight-image">
                      <AdvancedImage cldImg={cloudinaryImg(elem.product.image)} />
                    </div>
                    <Card.Body>
                      <div className="highlight-details">
                        <Card.Title>{elem.product.name}</Card.Title>
                        <Card.Text className="item-size">{elem.size}kg</Card.Text>
                        <Card.Text className="old-price">${(elem.sell_price).toFixed(2)}</Card.Text>
                        <Card.Text className="new-price">${(elem.sell_price * 0.95).toFixed(2)}</Card.Text>
                      </div>
                      <div className="call-to-action_button highlight-btn">
                        <Button onClick={() => addToCart(elem)}>Agregar</Button>
                      </div>
                    </Card.Body>
                  </Card>
                ))}
              </div>
            </Carousel.Item>
          ))
        ) : (
          <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
        )}
      </Carousel>
      {
        showNewProd && <NewProd product={newProd} />
      }
    </div>
  );
}