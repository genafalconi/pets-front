import { useEffect, useState, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GET_PRODUCTS } from "../../redux/actions";
import ProductCart from "./ProductCard";
import LazyComponent from "../../helpers/lazyComponents";
import CustomPagination from "../atomic/CustomPagination";
import DogAnimation from "../atomic/DogAnimation";
import ProductFilters from "../atomic/ProductFilters";
import '../../styles/components/product.scss';
import '../../styles/components/filters.scss';

export default function Products() {

  const dispatch = useDispatch();
  const { products, current_page, total_pages, input } = useSelector((state) => state.clientReducer);

  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(current_page);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    animal: [],
    size: [],
    age: [],
    price: null
  });

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

  const getProducts = useCallback(() => {
    setIsLoading(true)
    dispatch(GET_PRODUCTS({ filterData: selectedFilters, input: input, page: currentPage })).then((res) => {
      if (res.payload) setIsLoading(false);
    })
  }, [dispatch, selectedFilters, currentPage, input])

  const resetPage = () => {
    setCurrentPage(1);
  };

  useEffect(() => {
    resetPage();
  }, [input, selectedFilters]);

  useEffect(() => {
    getProducts();
  }, [getProducts]);

  return (
    <div className="content-page">
      {isLoading ? (
        <DogAnimation />
      ) : (
        <div className="products-container">
          <div className="title filter-title">
            <h1>Productos</h1>
            <div className="subprod__button filter-button">
              <span className="info-filters">Realiza una busqueda facil, utiliza los filtros</span>
              <button className="not-selected" onClick={() => setShowFilters(!showFilters)}>Filtros</button>
            </div>
            {
              showFilters && (
                <ProductFilters
                  showFilters={showFilters}
                  setShowFilters={setShowFilters}
                  selectedFilters={selectedFilters}
                  setSelectedFilters={setSelectedFilters}
                />
              )
            }
          </div>
          <div className="list-products">
            {activeProducts && activeProducts.length !== 0 ? (
              <>
                {activeProducts}
                <CustomPagination currentPage={currentPage} totalPages={total_pages} handlePageClick={handlePageClick} />
              </>
            ) : (
              <h2>No hay productos</h2>
            )}
          </div>
        </div>
      )}
    </div>
  );
}