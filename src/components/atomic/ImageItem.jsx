import { AdvancedImage } from "@cloudinary/react";
import { cloudinaryImg } from "../../helpers/cloudinary";

export default function ImageItem({ name, img }) {
  return (
    <AdvancedImage cldImg={cloudinaryImg(img)} alt={name} />
  )
}