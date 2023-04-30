import { useEffect } from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { GET_FILTER_PRODUCTS } from '../../redux/actions';
import ProductCart from '../Product/ProductCard';

export default function ProductList() {

  const [filterProds, setFilterProds] = useState({});
  const filterProducts = useSelector((state) => state.clientReducer.products)
  const dispatch = useDispatch()

  const handleFilterChange = (filter) => {
    setFilterProds(filter);
  }

  const handleFilterSubmit = () => {
    console.log(filterProds)
    dispatch(GET_FILTER_PRODUCTS(filterProds))
  }

  useEffect(() => {

  }, [filterProducts])

  return (
    <>
      <div>
        <AnimalTypeFilter onFilterChange={handleFilterChange} />
        <AgeFilter filterProds={filterProds} onFilterChange={handleFilterChange} />
        <SizeFilter filterProds={filterProds} onFilterChange={handleFilterChange} />
        <ProductTypeFilter filterProds={filterProds} onFilterChange={handleFilterChange} />
        <button onClick={handleFilterSubmit}>Buscar Productos</button>
      </div>
      <div className="list-products">
        {
          filterProducts ?
            filterProducts.map((elem) => {
              return <ProductCart key={elem._id} data={elem} />
            })
            : ''
        }
      </div>
    </>
  );
}

function AnimalTypeFilter({ filterProds, onFilterChange }) {
  const handleAnimalTypeChange = (animalType) => {
    onFilterChange({ ...filterProds, animal: animalType });
  }

  return (
    <div>
      <button onClick={() => handleAnimalTypeChange('DOG')}>Perro</button>
      <button onClick={() => handleAnimalTypeChange('CAT')}>Gato</button>
    </div>
  );
}

function AgeFilter({ filterProds, onFilterChange }) {
  const handleSizeChange = (age) => {
    onFilterChange({ ...filterProds, age: age });
  }

  if (!filterProds.animal) {
    return null;
  }

  return (
    <div>
      <button onClick={() => handleSizeChange('PUPPY')}>Cachorro</button>
      <button onClick={() => handleSizeChange('ADULT')}>Adulto</button>
      <button onClick={() => handleSizeChange('SENIOR')}>Senior</button>
    </div>
  );
}

function SizeFilter({ filterProds, onFilterChange }) {
  const handleSizeChange = (size) => {
    onFilterChange({ ...filterProds, size: size });
  }

  if (filterProds.animal === 'CAT' || !filterProds.age) {
    return null;
  }

  return (
    <div>
      <button onClick={() => handleSizeChange('SMALL')}>Chico</button>
      <button onClick={() => handleSizeChange('MEDIUM')}>Mediano</button>
      <button onClick={() => handleSizeChange('LARGE')}>Grande</button>
    </div>
  );
}

function ProductTypeFilter({ filterProds, onFilterChange }) {
  const handleProductTypeChange = (productType) => {
    onFilterChange({ ...filterProds, category: productType });
  }
  console.log(filterProds)
  if (!filterProds.age || (filterProds.size && filterProds.animal === 'CAT')) {
    return null;
  }

  return (
    <div>
      <button onClick={() => handleProductTypeChange('ALIMENTO BALANCEADO')}>Alimento balanceado</button>
      <button onClick={() => handleProductTypeChange('ACCESORIOS')}>Accesorios</button>
      <button onClick={() => handleProductTypeChange('MEDICAMENTOS')}>Medicamentos</button>
    </div>
  );
}
