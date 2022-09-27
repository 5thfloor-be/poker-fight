import { useState } from "react";

type CoffeeTimeProps = {
  showCoffeeTime: boolean;
  setShowCoffeeTime: (val: any) => void;
};

const CoffeeTime = (props: CoffeeTimeProps) => {
  const [showCoffeeTime, setShowCoffeeTime] = useState(props.showCoffeeTime);

  const finish = () => setShowCoffeeTime(false);

  return <div>CoffeeTime</div>;
};

export default CoffeeTime;
