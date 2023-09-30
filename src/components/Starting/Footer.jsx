import { IoMailOutline } from 'react-icons/io5';
import { BiPhone } from 'react-icons/bi';
import { AiOutlineInstagram } from 'react-icons/ai';

export default function Footer({ isLoadingHighlight }) {

  const handlePhone = () => {
    const phoneNumber = '+5491138312454';
    const telLink = `tel:${phoneNumber}`;
    window.location.href = telLink;
  }

  const handleInstagram = () => {
    const instagramUsername = 'pets___zone';
    const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    if (isMobileDevice) {
      const instagramAppURL = `instagram://user?username=${instagramUsername}`;
      window.location.href = instagramAppURL;
    } else {
      const instagramWebURL = `https://www.instagram.com/${instagramUsername}`;
      window.open(instagramWebURL, '_blank');
    }
  };
  

  const handleEmail = () => {
    const emailAddress = 'petszonee@gmail.com';
    const mailtoLink = `mailto:${emailAddress}`;
    window.location.href = mailtoLink;
  };

  return (
    <>
      {
        !isLoadingHighlight && (
          <footer className='footer'>
            <div className="service">
              <p>Zonas</p>
              <ul>
                <li>Tigre</li>
                <li>San Fernando</li>
                <li>Nordelta</li>
                <li>Benavidez</li>
                <li>Pacheco</li>
              </ul>
            </div>
            <div className="info-company">
              <div className="contact">
                <p>Contacto</p>
                <div className="icons-redes">
                  <BiPhone onClick={handlePhone} size={15} />
                  <AiOutlineInstagram onClick={handleInstagram} size={15} />
                  <IoMailOutline onClick={handleEmail} size={15} />
                </div>
              </div>
              <div className="company">
                &copy; {new Date().getFullYear()} Pet's Zone
              </div>
            </div>
          </footer>
        )
      }
    </>
  )
}