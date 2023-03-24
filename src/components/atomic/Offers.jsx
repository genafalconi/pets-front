import { useState } from 'react';
import '../../styles/components/offers.scss'

export default function Offers({ offers, setSelectedOfferData }) {

  const [selectedOffer, setSelectedOffer] = useState(null);

  const handleOfferClick = (offer) => {
    setSelectedOffer(offer)
    setSelectedOfferData(offer)
  };

  return (
    <div className='offers-table'>
      {offers.map((offer) => (
        <table key={offer.id}>
          <thead>
            <tr>
              <th>{offer.weekday.toUpperCase()} {offer.date?.split('-')[2]}</th>
            </tr>
          </thead>
          <tbody>
            <tr key={offer.id} onClick={() => handleOfferClick(offer)} className={selectedOffer === offer ? 'selected-offer' : ''}>
              <td>
                <p>{offer.hours}</p>
                <p>GRATIS</p>
              </td>
            </tr>
          </tbody>
        </table>
      ))}
    </div>
  );
}