import styles from "../styles/Card.module.css";
import Image from "next/image";
import { MdAccountCircle } from 'react-icons/md';

export interface CardProps {
  value?: number;
  canClose: boolean;
  color: string;
}

const Card = ({ value, canClose, color }: CardProps) => {
  return (
    <div className={`card ${styles.customCard}`}>
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

export default Card
