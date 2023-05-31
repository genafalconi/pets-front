import { useEffect, useState, useMemo, useCallback } from "react";
import { Pagination, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { GET_ACTIVE_PRODUCTS, SEARCH_PRODUCTS } from "../../redux/actions";
import ProductCart from "./ProductCard";
import LazyComponent from "../../helpers/lazyComponents";

export default function Products() {

  const input = new URLSearchParams(useLocation().search).get("input");
  const query = new URLSearchParams(useLocation().search).get("animal");
  const dispatch = useDispatch();
  const { products, products_filtered, current_page, total_pages } = useSelector((state) => state.clientReducer);

  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(current_page);

  const activeProducts = useMemo(() => {
    const productsToRender = input ? products_filtered : products;
    return Array.isArray(productsToRender) && productsToRender?.map((elem) => (
      <LazyComponent key={elem._id}>
        <ProductCart data={elem} />
      </LazyComponent>
    ));
  }, [products, products_filtered, input]);

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const getSearchedProducts = useCallback(() => {
    setIsLoading(true)
    dispatch(SEARCH_PRODUCTS({ input_value: input, page: currentPage })).then((res) => {
      if (res.payload) setIsLoading(false);
    })
  }, [dispatch, currentPage, input])

  const getActiveProducts = useCallback(() => {
    setIsLoading(true);
    dispatch(GET_ACTIVE_PRODUCTS({ animal: query, page: currentPage })).then((res) => {
      if (res.payload) setIsLoading(false);
    });
  }, [dispatch, query, currentPage]);

  useEffect(() => {
    if (!input) {
      getActiveProducts();
    } else {
      getSearchedProducts();
    }
  }, [getActiveProducts, getSearchedProducts, input]);

  return (
    <div className="content-page">
      {isLoading ? (
        <div className="loading">
          <Spinner as="span" animation="border" size="xl" role="status" aria-hidden="true" />
        </div>
      ) : (
        <div className="products-container">
          <div className="title">
            <h1>Productos</h1>
          </div>
          <div className="list-products">
            {activeProducts && activeProducts.length !== 0 ? (
              activeProducts
            ) : (
              <h2>No hay productos</h2>
            )}
          </div>
          <Pagination>
            <Pagination.First onClick={() => handlePageClick(1)} />
            <Pagination.Prev onClick={() => handlePageClick(currentPage - 1)} />
            {[...Array(total_pages)].map((_, i) => {
              return (
                <Pagination.Item
                  key={i}
                  active={currentPage === i + 1}
                  onClick={() => handlePageClick(i + 1)}
                >
                  {i + 1}
                </Pagination.Item>
              );
            })}
            <Pagination.Next onClick={() => handlePageClick(currentPage + 1)} />
            <Pagination.Last onClick={() => handlePageClick(total_pages)} />
          </Pagination>
        </div>
      )}
    </div>
  );
}