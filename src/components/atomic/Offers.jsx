import { useEffect, useState } from 'react';
import '../../styles/components/offers.scss';
import { Table } from 'react-bootstrap';

function formatOfferDate(dateString) {
  const date = new Date(dateString);
  const day = date.getUTCDate();
  const month = date.getUTCMonth() + 1;
  return `${day < 10 ? '0' : ''}${day}/${month < 10 ? '0' : ''}${month}`;
}

export default function Offers({ offers, setSelectedOfferData }) {
  const [selectedOffer, setSelectedOffer] = useState(null);

  const handleOfferClick = (offer) => {
    setSelectedOffer((prevOffer) => (prevOffer === offer ? null : offer));
  };

  useEffect(() => {
    setSelectedOfferData(selectedOffer);
  }, [selectedOffer, setSelectedOfferData]);

  return (
    <div className="offers-table">
      {offers?.map((offer) => (
        <Table striped bordered variant="dark" hover key={offer._id}>
          <thead>
            <tr>
              <th>{`${offer.weekday.toUpperCase()} ${formatOfferDate(offer.date)}`}</th>
            </tr>
          </thead>
          <tbody>
            <tr
              key={offer.id}
              onClick={() => handleOfferClick(offer)}
              className={selectedOffer === offer ? 'selected-offer' : ''}
            >
              <td>
                <p>{offer.from}-{offer.to}</p>
                <p>GRATIS</p>
              </td>
            </tr>
          </tbody>
        </Table>
      ))}
    </div>
  );
}