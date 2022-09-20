import styles from "../styles/Card.module.css";
import Image from "next/image";
import { MdAccountCircle } from 'react-icons/md';

export interface CardProps {
  value?: number;
  canClose: boolean;
  color: string;
  selected?: boolean;
}

const Card = ({ value, canClose, color, selected = false }: CardProps) => {
  return (
    <div className={!selected ? `card ${styles.customCard}` : `card ${styles.customCard} ${styles.customCardSelected}`}>
        <div>
            <Image alt="card" src="/images/favicon.png" width={50} height={50} />
        </div>
        <div className='text-center'>
            {value && <span className={`fw-bold text-success ${styles.valueCard}`}>{value}</span> }
            {color && <MdAccountCircle color={color} size={60}/>}
        </div>
        <div className={styles.logoBottom}>
            <Image  alt="card" src="/images/favicon.png" width={50} height={50} />
        </div>
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
