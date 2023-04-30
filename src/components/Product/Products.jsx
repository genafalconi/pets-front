import { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { GET_ACTIVE_PRODUCTS } from "../../redux/actions";
import ProductCart from "./ProductCard";

export default function Products() {

  const query = new URLSearchParams(useLocation().search).get('animal');
  const dispatch = useDispatch();
  const activeProducts = useSelector((state) => state.clientReducer.products);

  const [isLoading, setIsLoading] = useState(true);

  const offset = 0;

  const getActiveProducts = async (query) => {
    await dispatch(GET_ACTIVE_PRODUCTS(query)).then((res) => {
      if (res) {
        setIsLoading(false);
      }
    });
  };

  useEffect(() => {
    getActiveProducts(query);
    // eslint-disable-next-line
  }, []);

  return (
    <div className="content-page">
      {
        isLoading ?
          <div className="loading">
            <Spinner as="span" animation="border" size="xl" role="status" aria-hidden="true" />
          </div>
          :
          <div className="products-container">
            <div className="title">
              <h1>Productos</h1>
            </div>
            <div className="list-products">
              {activeProducts && activeProducts.length !== 0 ? (
                activeProducts
                  .slice(offset)
                  .map((elem) => <ProductCart key={elem._id} data={elem} />)
              ) : (
                <h2>No hay productos</h2>
              )}
            </div>
          </div>
      }
    </div>
  );
}
