import styles from '../styles/Card.module.css';
import Image from 'next/image';
import { MdAccountCircle } from 'react-icons/md';
import { Badge, OverlayTrigger, Popover } from 'react-bootstrap';

export interface CardProps {
    value?: number;
    canClose: boolean;
    color?: string;
    selected?: boolean;
    name?: string | null;
    badgeText?: string | null;
    popupText?: any;
}



const Card = ({value, canClose, color, selected = false, name = null, badgeText = null, popupText = null}: CardProps) => {
    const popover = (
            <Popover id="popover-basic">
                <Popover.Header as="h3">Voters</Popover.Header>
                <Popover.Body>
                    {popupText}
                </Popover.Body>
            </Popover>
    )
    return (
        <div
            className={!selected ? `card ${styles.customCard}` : `card ${styles.customCard} ${styles.customCardSelected}`}>
            <div>
                <Image alt="card" src="/images/favicon.png" width={50} height={50}/>
            </div>
            <div className="text-center">
                {value && <span className={`fw-bold text-success ${styles.valueCard}`}>{value}</span>}
                {color && <MdAccountCircle color={color} size={60}/>}
            </div>
            <div className={styles.logoBottom}>
                <Image alt="card" src="/images/favicon.png" width={50} height={50}/>
            </div>
            {
                name && <p className="position-absolute top-100 start-100 translate-middle fw-bold pe-5 pt-3">{name}</p>
            }
            {
                badgeText && <OverlayTrigger trigger="click" placement="right" overlay={popover}>
                    <Badge bg={'danger'} pill={true}
                           className="position-absolute top-0 start-100 translate-middle">{badgeText}</Badge>
                </OverlayTrigger>
            }

        </div>
  )
}

const style = {
  fontSize: '150px',
  color: 'blue'
  // backgroundColor: 'white'
}

const backgoundNotSelectedStyle = {
  backgroundImage: "url('/images/card-backgound.png')",
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover',
  width: '185px'
}

const backgoundSelectedStyle = {
  backgroundColor: 'yellow',
  width: '185px'
}
export default Card
