import Image from "next/image";

export interface CardProps {
  value: number;
  canClose: boolean;
}

const Card = ({ value, canClose }: CardProps) => {
  return (
    <div style={{ backgroundImage: "url('/images/card-backgound.png')", backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundSize: 'cover', width: '185px'}}>
      <div style={{ width: '50px', height: '50px' }}>
        <Image alt="card" src="/favicon.ico" width={50} height={50} /> </div>
      <div style={{ textAlign: 'center'}}>
        <span style={style}>{value}</span>
      </div>
    <div style={{ transform: 'rotate(180deg)'}}>
    <Image  alt="card" src="/favicon.ico" width={50} height={50} />
      </div>
    </div>
  )
}

const style = {
  fontSize: '150px',
  color: 'blue'
  // backgroundColor: 'white'
}

export default Card
