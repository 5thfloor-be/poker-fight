import {useEffect, useState} from "react";
import Card from "./Card";

export interface DeckProps {
  deck: number[];
  updateSelection: Function;
  canClose?: boolean;
  isLocked?: boolean;
}
export const Deck = ({ deck, updateSelection, canClose, isLocked }: DeckProps) => {
const [selectedIndex, setSelectedIndex] = useState(-1);

const selectIndex = ( index: number) => {
    console.log('deck ' + index);
    if (!isLocked) {
        setSelectedIndex(index);
        updateSelection(deck[index])
    }
}

  return (
    <div className="container">
      <div className="row">
        {deck.map((score, index) => (
          <div className="col mb-3" key={score} onClick={() => selectIndex(index)}>
            <Card key={score} value={score} canClose={canClose} selected={selectedIndex === index} />
          </div>
        ))}
      </div>
    </div>
  )
}
