import { AdvancedImage } from "@cloudinary/react";
import { AnimalDto } from "../../helpers/constants";
import { cloudinaryImg } from "../../helpers/cloudinary";
import { useNavigate } from "react-router-dom";

const CAT_PUBLIC_ID = 'Animal/cat_4445870_okpepp'
const DOG_PUBLIC_ID = 'Animal/labrador_5374247_kbenxd'

export default function GetAnimalBySearch({ animal }) {
  const navigate = useNavigate();

  const handleImageClick = (selected) => {
    navigate(`/products?animal=${selected}`);
  };

  return (
    <div className="d-flex align-items-center justify-content-center">
      <AdvancedImage
        className={`animal-search-image ${animal === AnimalDto.DOG ? "selected" : ""}`}
        alt='Dog'
        cldImg={cloudinaryImg(DOG_PUBLIC_ID)}
        onClick={() => handleImageClick(AnimalDto.DOG)}
      />
      <AdvancedImage
        className={`animal-search-image ${animal === AnimalDto.CAT ? "selected" : ""}`}
        alt='Cat'
        cldImg={cloudinaryImg(CAT_PUBLIC_ID)}
        onClick={() => handleImageClick(AnimalDto.CAT)}
      />
    </div>
  );
}
