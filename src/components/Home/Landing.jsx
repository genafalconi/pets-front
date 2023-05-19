import '../../App.scss'
import LazyComponent from '../../helpers/lazyComponents';
import AnimalCards from '../segmentation/AnimalCards'

export default function Landing() {
  return (
    <>
      <LazyComponent>
        <AnimalCards />
      </LazyComponent>
    </>
  );
}