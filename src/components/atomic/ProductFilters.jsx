import { Button, Form, Modal } from "react-bootstrap";
import '../../styles/components/product.scss';
import '../../styles/components/filters.scss';
import { useEffect, useState } from "react";

export default function ProductFilters({ showFilters ,setShowFilters, selectedFilters, setSelectedFilters, setSearchByFilter }) {

  const [filters, setFilters] = useState({
    animal: [],
    size: [],
    age: [],
    price: null
  });

  const handleFilterClick = (category, value) => {
    setFilters((prevFilters) => {
      const updatedFilters = { ...prevFilters };
      if (category === "price") {
        updatedFilters[category] = value;
      } else {
        if (updatedFilters[category].includes(value)) {
          updatedFilters[category] = updatedFilters[category].filter((item) => item !== value);
        } else {
          updatedFilters[category].push(value);
        }
      }
      return updatedFilters;
    });
  };

  const handleSearch = () => {
    setShowFilters(false);
    setSearchByFilter(true);
    setSelectedFilters({ ...filters });
    setFilters(filters)
  };

  useEffect(() => {
    if (Object.keys(selectedFilters).length !== 0) {
      setFilters({ ...selectedFilters })
    }
  }, [selectedFilters])

  return (
    <Modal
      show={showFilters}
      onHide={() => setShowFilters(false)}
      size='lg'
      aria-labelledby="contained-modal-title-vcenter"
      centered
      className='modal-filters'
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter" >
          Filtros
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className='modal-filters-body'>
        <div className="prod-filters">
          <div className="filter-row">
            <div className="filter-col">
              <span>Animal</span>
              <div className="switches">
                <div
                  className={`selectable-filter ${filters.animal.includes("DOG") ? "selected" : ""}`}
                  onClick={() => handleFilterClick("animal", "DOG")}
                >
                  Perro
                </div>
                <div
                  className={`selectable-filter ${filters.animal.includes("CAT") ? "selected" : ""}`}
                  onClick={() => handleFilterClick("animal", "CAT")}
                >
                  Gato
                </div>
              </div>
            </div>
            <div className="filter-col">
              <span>Tamaño</span>
              <div className="switches">
                <div
                  className={`selectable-filter ${filters.size.includes("SMALL") ? "selected" : ""}`}
                  onClick={() => handleFilterClick("size", "SMALL")}
                >
                  Pequeño
                </div>
                <div
                  className={`selectable-filter ${filters.size.includes("MEDIUM") ? "selected" : ""}`}
                  onClick={() => handleFilterClick("size", "MEDIUM")}
                >
                  Mediano
                </div>
                <div
                  className={`selectable-filter ${filters.size.includes("LARGE") ? "selected" : ""}`}
                  onClick={() => handleFilterClick("size", "LARGE")}
                >
                  Grande
                </div>
                <div
                  className={`selectable-filter ${filters.size.includes("ALL") ? "selected" : ""}`}
                  onClick={() => handleFilterClick("size", "ALL")}
                >
                  Todos
                </div>
              </div>
            </div>
          </div>
          <div className="filter-row">
            <div className="filter-col">
              <span>Edad</span>
              <div className="switches">
                <div
                  className={`selectable-filter ${filters.age.includes("KITTEN") ? "selected" : ""}`}
                  onClick={() => handleFilterClick("age", "KITTEN")}
                >
                  Kitten
                </div>
                <div
                  className={`selectable-filter ${filters.age.includes("PUPPY") ? "selected" : ""}`}
                  onClick={() => handleFilterClick("age", "PUPPY")}
                >
                  Cachorro
                </div>
                <div
                  className={`selectable-filter ${filters.age.includes("ADULT") ? "selected" : ""}`}
                  onClick={() => handleFilterClick("age", "ADULT")}
                >
                  Adulto
                </div>
                <div
                  className={`selectable-filter ${filters.age.includes("SENIOR") ? "selected" : ""}`}
                  onClick={() => handleFilterClick("age", "SENIOR")}
                >
                  Senior
                </div>
              </div>
            </div>
            <div className="filter-col">
              <span>Precio maximo</span>
              <div className="ranges">
                <span>{filters.price !== null && `$${filters.price}`}</span>
                <Form.Range
                  min={0}
                  max={50000}
                  step={500}
                  onChange={(e) => handleFilterClick("price", Number(e.target.value))}
                />
                <div className="range-labels">
                  <span>$0</span>
                  <span>$50.000</span>
                </div>
              </div>
            </div>
          </div>
          <div className="call-to-action_button filter-btn">
            <Button className="call-to-action_button" onClick={handleSearch}>Buscar</Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}