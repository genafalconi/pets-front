import { useEffect, useState, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { GET_ACTIVE_PRODUCTS, SEARCH_PRODUCTS } from "../../redux/actions";
import ProductCart from "./ProductCard";
import LazyComponent from "../../helpers/lazyComponents";
import getAnimalBySearch from "../../helpers/getAnimalBySearch";
import CustomPagination from "../atomic/CustomPagination";
import DogAnimation from "../atomic/DogAnimation";

export default function Products() {

  const input = new URLSearchParams(useLocation().search).get("input");
  const animal = new URLSearchParams(useLocation().search).get("animal");

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { products, current_page, total_pages } = useSelector((state) => state.clientReducer);

  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(current_page);
  const [selectedAnimal, setSelectedAnimal] = useState(animal);

  const activeProducts = useMemo(() => {
    const productsToRender = products;
    return Array.isArray(productsToRender) && productsToRender?.map((elem) => (
      <LazyComponent key={elem._id}>
        <ProductCart data={elem} />
      </LazyComponent>
    ));
  }, [products]);

  const handlePageClick = (pageNumber) => {
    if (pageNumber <= total_pages && pageNumber >= 1) {
      setCurrentPage(pageNumber);
    }
  };

  const getSearchedProducts = useCallback(() => {
    setIsLoading(true)
    dispatch(SEARCH_PRODUCTS({ input_value: input, page: currentPage, animal: animal })).then((res) => {
      if (res.payload) setIsLoading(false);
    })
  }, [dispatch, currentPage, input, animal])

  const getActiveProducts = useCallback(() => {
    setIsLoading(true);
    dispatch(GET_ACTIVE_PRODUCTS(currentPage)).then((res) => {
      if (res.payload) setIsLoading(false);
    });
  }, [dispatch, currentPage]);

  const handleAnimalSelected = useCallback((selectedAnimal) => {
    setSelectedAnimal(selectedAnimal);
    navigate(`/products?animal=${selectedAnimal}${input ? `&input=${input}` : ''}`)
  }, [input, navigate]);

  useEffect(() => {
    if (!input && !animal) {
      getActiveProducts();
    } else {
      getSearchedProducts();
    }
  }, [getActiveProducts, getSearchedProducts, input, animal]);

  return (
    <div className="content-page">
      {isLoading ? (
        <DogAnimation />
      ) : (
        <div className="products-container">
          <div className="title">
            <h1>Productos</h1>
            {getAnimalBySearch(selectedAnimal, handleAnimalSelected)}
          </div>
          <div className="list-products">
            {activeProducts && activeProducts.length !== 0 ? (
              activeProducts
            ) : (
              <h2>No hay productos</h2>
            )}
          </div>
          <CustomPagination currentPage={currentPage} totalPages={total_pages} handlePageClick={handlePageClick} />
        </div>
      )}
    </div>
  );
}