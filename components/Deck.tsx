import { useState } from "react";
import Card from "./Card";

export interface DeckProps {
  deck: [];
}
export const Deck = ({ deck }: DeckProps) => {
const [selectedIndex, setSelectedIndex] = useState(-1);

  return (
    <div className="container">
      <div className="row">
        {deck.map((score, index) => (
          <div className="col-4" key={score} onClick={() => setSelectedIndex(index)}>
            <Card key={score} value={score} canClose={false} selected={selectedIndex === index} />
          </div>
        ))}
      </div>
    </div>
  )
}