import { useCallback, useState } from "react";
import { Button, Card, Spinner } from "react-bootstrap"
import { useDispatch, useSelector } from "react-redux";
import { ADD_TO_CART, ADD_TO_LOCAL_CART } from "../../redux/actions";
import { AdvancedImage } from "@cloudinary/react";
import { cloudinaryImg } from "../../helpers/cloudinary";
import NewProd from "../Product/NewProd";

export default function HighlightCard({ item }) {
  const dispatch = useDispatch();
  const { highlights } = useSelector((state) => state.clientReducer);

  const user = localStorage.getItem('user');
  const [isLoading, setIsLoading] = useState(false);
  const [showNewProd, setShowNewProd] = useState(false);
  const [newProd, setNewProd] = useState(null);

  const calculateDiscountPercentage = (sellPrice, salePrice) => {
    return Math.floor(((sellPrice - salePrice) / sellPrice) * 100);
  };

  const addToCart = useCallback((data) => {
    const subprod = highlights.find((item) => item._id === data._id)
    const subProdToAdd = {
      _id: subprod?._id,
      product: subprod?.product?._id,
      buy_price: subprod?.buy_price,
      sell_price: subprod?.sell_price,
      sale_price: subprod.sale_price,
      size: subprod?.size,
      stock: subprod?.stock,
      highlight: true,
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

  }, [dispatch, highlights, user, setIsLoading, setNewProd, setShowNewProd])

  return (
    <>
      <Card key={item._id} className="highlight-card">
        <span className="label-highlight">{calculateDiscountPercentage(item.sell_price, item.sale_price)}%</span>
        <div className="highlight-image">
          <AdvancedImage cldImg={cloudinaryImg(item.product.image)} />
        </div>
        <Card.Body>
          <div className="highlight-details">
            <Card.Title>{item.product.name}</Card.Title>
            <Card.Text className="item-size">{item.size}kg</Card.Text>
            <Card.Text className="old-price">${(item.sell_price).toFixed(2)}</Card.Text>
            <Card.Text className="new-price">${(item.sale_price).toFixed(2)}</Card.Text>
          </div>
          <div className="call-to-action_button highlight-btn">
            {
              isLoading ?
                <Button disabled>
                  <Spinner as="span" animation="border" size='sm' role="status" aria-hidden="true" />
                </Button>
                :
                <Button onClick={() => addToCart(item)}>Agregar</Button>
            }
          </div>
        </Card.Body>
      </Card>
      {
        showNewProd && <NewProd product={newProd} />
      }
    </>
  )
}