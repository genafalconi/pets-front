import { useEffect, useState } from 'react';
import '../../styles/components/offers.scss';

function formatOfferDate(dateString) {
  const date = new Date(dateString);
  const day = date.getUTCDate();
  const month = date.getUTCMonth() + 1;
  return `${day < 10 ? '0' : ''}${day}/${month < 10 ? '0' : ''}${month}`;
}

export default function Offers({ offers, setSelectedOfferData }) {
  const [selectedOffer, setSelectedOffer] = useState(null);

  useEffect(() => {
    setSelectedOfferData(selectedOffer);
  }, [selectedOffer, setSelectedOfferData]);

  const handleOfferClick = (offer) => {
    setSelectedOffer((prevSelectedOffer) =>
      prevSelectedOffer === offer ? null : offer
    );
  };

  return (
    <div className="offers-container">
      {offers?.map((offer) => (
        <div
          key={offer._id}
          onClick={() => handleOfferClick(offer)}
          className={`offer-card ${selectedOffer === offer && 'offer-card selected-offer'}`}
        >
          <div>
            <h5>{`${offer.weekday.toUpperCase()} ${formatOfferDate(offer.date)}`}</h5>
            <div className='text-offer'>
              <p>{offer.from}h-{offer.to}h</p>
              <p>GRATIS</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
