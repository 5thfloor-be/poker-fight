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
    badgeConfig?: BadgeConfig;
}

export interface BadgeConfig {
    badgeText?: string | null;
    popupText?: any;
    popupTitle?: string | null;
    position?: string | null;
}


const Card = ({value, canClose, color, selected = false, name = null, badgeConfig = {}}: CardProps) => {
    const popover = (
            <Popover id="popover-basic">
                {badgeConfig?.popupTitle && <Popover.Header as="h3">{badgeConfig?.popupTitle}</Popover.Header>}
                <Popover.Body>
                    {badgeConfig?.popupText}
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
                badgeConfig && <OverlayTrigger trigger="click" placement={badgeConfig?.position} overlay={popover}>
                        <Badge bg={'danger'} pill={true}
                               className={ badgeConfig.position == "left" ? "position-absolute top-0 start-0 translate-middle" : "position-absolute top-0 start-100 translate-middle"}>{badgeConfig.badgeText}</Badge>
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
