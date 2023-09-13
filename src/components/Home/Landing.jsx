import { useEffect, useState } from 'react';
import '../../App.scss'
import LazyComponent from '../../helpers/lazyComponents';
import Highlights from '../Starting/Highlight';
import Carousel from '../Starting/ImageCarousel';

export default function Landing() {

  const [isLoadingHighlight, setIsLoadingHighlight] = useState(true);

  useEffect(() => {

  }, [isLoadingHighlight])

  return (
    <LazyComponent>
      <Carousel isLoadingHighlight={isLoadingHighlight} />
      <Highlights setIsLoadingHighlight={setIsLoadingHighlight} />
      <br />
    </LazyComponent>
  );
}