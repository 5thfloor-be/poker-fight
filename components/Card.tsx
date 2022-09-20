import styles from '../styles/Card.module.css';
import Image from 'next/image';
import { MdAccountCircle } from 'react-icons/md';
import { Badge, OverlayTrigger, Popover } from 'react-bootstrap';
import {GrFormClose} from "react-icons/Gr";

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

const Card = ({ value, canClose, color, selected = false,name = null, badgeConfig = {} }: CardProps) => {
    const popover = (
        <Popover id="popover-basic">
            {badgeConfig?.popupTitle && <Popover.Header as="h3">{badgeConfig?.popupTitle}</Popover.Header>}
            <Popover.Body>
                {badgeConfig?.popupText}
            </Popover.Body>
        </Popover>
    )
    return (
        <div>
            <div
                className={!selected ? `card ${styles.customCard}` : `card ${styles.customCard} ${styles.customCardSelected}`}>
                <div className="row">
                    <div className={"d-none d-sm-block col-sm-6"}>
                        <Image alt="card" src="/images/favicon.png" width={50} height={50}/>
                    </div>
                    {canClose && <div className="col-12 col-sm-6 text-end">
                        <button className="btn btn-sm btn-danger rounded-5 float-end t"
                            >
                            x
                        </button>
                    </div>}
                </div>

                <div className='text-center'>
                    {value && <span className={`fw-bold text-primary ${styles.valueCard}`}>{value}</span>}
                    {color && <MdAccountCircle color={color} size={60}/>}
                </div>
                <div className={`d-none d-sm-block ${styles.logoBottom}`}>
                    <Image alt="card" src="/images/favicon.png" width={50} height={50}/>
                </div>
            </div>
            {name &&
                <div className="text-sm-center">
                    <h3>{name}</h3>
                </div>
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
