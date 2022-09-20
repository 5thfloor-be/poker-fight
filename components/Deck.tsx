import { useState } from "react";
import Card from "./Card";

export interface DeckProps {
  deck: [];
  updateSelection: Function;
}
export const Deck = ({ deck, updateSelection }: DeckProps) => {
const [selectedIndex, setSelectedIndex] = useState(-1);

const selectIndex = ( index: number) => {
    console.log('deck ' + index);
    setSelectedIndex(index);
    updateSelection(deck[index])
}

  return (
    <div className="container">
      <div className="row">
        {deck.map((score, index) => (
          <div className="col" key={score} onClick={() => selectIndex(index)}>
            <Card key={score} value={score} canClose={false} selected={selectedIndex === index} />
          </div>
        ))}
      </div>
    </div>
  )
}