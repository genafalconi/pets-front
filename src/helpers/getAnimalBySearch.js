import { AdvancedImage } from "@cloudinary/react";
import { AnimalDto } from "./constants";
import { cloudinaryImg } from "./cloudinary";

const CAT_PUBLIC_ID = 'Animal/cat_4445870_okpepp'
const DOG_PUBLIC_ID = 'Animal/labrador_5374247_kbenxd'

export default function getAnimalBySearch(animal, handleClick) {
  let selectedAnimal = animal;

  const handleImageClick = (selected) => {
    if (selected === selectedAnimal) {
      selectedAnimal = null;
    } else {
      selectedAnimal = selected;
    }
    handleClick(selectedAnimal);
  };

  return (
    <div className="d-flex align-items-center justify-content-center">
      <AdvancedImage
        className={`animal-search-image ${selectedAnimal === AnimalDto.DOG ? "selected" : ""}`}
        alt='Dog'
        cldImg={cloudinaryImg(DOG_PUBLIC_ID)}
        onClick={() => handleImageClick(AnimalDto.DOG)}
      />
      <AdvancedImage
        className={`animal-search-image ${selectedAnimal === AnimalDto.CAT ? "selected" : ""}`}
        alt='Cat'
        cldImg={cloudinaryImg(CAT_PUBLIC_ID)}
        onClick={() => handleImageClick(AnimalDto.CAT)}
      />
    </div>
  );
}
