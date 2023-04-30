import { useEffect, useState } from 'react';
import '../../styles/components/offers.scss'

export default function Offers({ offers, setSelectedOfferData }) {

  const [selectedOffer, setSelectedOffer] = useState(null);
  const [offersFormatted, setOffersFormatted] = useState(null);

  const handleOfferClick = (offer) => {
    if (selectedOffer === offer) {
      setSelectedOffer(null);
      setSelectedOfferData(null);
    } else {
      setSelectedOffer(offer);
      setSelectedOfferData(offer);
    }
  };

  useEffect(() => {
    const modifiedOffers = offers?.map((elem) => {
      const date = new Date(elem?.date);
      console.log(date, typeof date)
      const day = date.getUTCDate();
      const month = date.getUTCMonth() + 1;
      const formattedDate = `${day < 10 ? '0' : ''}${day}/${month < 10 ? '0' : ''}${month}`;
      return {
        ...elem, // Copy all properties from the original object
        date: formattedDate // Overwrite the date property with the formatted date
      };
    });
    setOffersFormatted(modifiedOffers);
  }, [offers])

  return (
    <div className='offers-table'>
      {
        offersFormatted?.map((offer) => (
          <table key={offer._id}>
            <thead>
              <tr>
                <th>{offer.weekday.toUpperCase()} {offer.date}</th>
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
        ))
      }
    </div>
  );
}