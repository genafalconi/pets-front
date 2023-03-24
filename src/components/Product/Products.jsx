import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GET_ACTIVE_PRODUCTS } from "../../redux/actions";
import ProductCart from "./ProductCard";
import Spinner from 'react-bootstrap/Spinner';
import "../../styles/components/product.scss";

export default function Products() {
  const dispatch = useDispatch();
  const activeProducts = useSelector((state) => state.clientReducer.products);

  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [productsPerPage, setProductsPerPage] = useState(20);
  const offset = 0

  const getActiveProducts = async () => {
    await dispatch(GET_ACTIVE_PRODUCTS()).then((res) => {
      setIsLoading(false)
    })
  }

  const loadMore = useCallback(() => {
    setIsLoadingMore(true);
    setProductsPerPage((prevProductsPerPage) => prevProductsPerPage + 20);
    setIsLoadingMore(false)
  }, []);

  useEffect(() => {
    getActiveProducts();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight =
        "innerHeight" in window
          ? window.innerHeight
          : document.documentElement.offsetHeight;
      const body = document.body;
      const html = document.documentElement;
      const docHeight = Math.max(
        body.scrollHeight,
        body.offsetHeight,
        html.clientHeight,
        html.scrollHeight,
        html.offsetHeight
      );
      const windowBottom = windowHeight + window.pageYOffset;
      if (windowBottom >= docHeight) {
        loadMore()
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loadMore]);

  return (
    <div className="content-page">
      {
        isLoading ?
          <div className="loading">
            <Spinner as="span" animation="border" size='xl' role="status" aria-hidden="true" />
          </div>
          : activeProducts.length === 0 ?
            <h2>No hay productos</h2>
            :
            <div className="products-container">
              <div className="title">
                <h1>Productos</h1>
              </div>
              <div className="list-products">
                {
                  activeProducts
                    .slice(offset, offset + productsPerPage)
                    .map((elem) => <ProductCart key={elem.id} data={elem} />)
                }
              </div>
            </div>
      }
      {isLoadingMore && <p>Loading more products...</p>}
    </div>
  );
}
