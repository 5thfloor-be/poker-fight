import { useEffect, useState } from "react";
import Card from "./Card";

export interface DeckProps {
  deck: number[];
  updateSelection: Function;
  canClose?: boolean;
  isLocked?: boolean;
  currentVote?: number;
}
export const Deck = ({
  deck,
  updateSelection,
  canClose,
  isLocked,
  currentVote,
}: DeckProps) => {
  const [selectedIndex, setSelectedIndex] = useState(-1);

  useEffect(() => {
    if (currentVote) {
      console.log(
        `selectedIndex ${selectedIndex}, current vote ${currentVote}, deck`,
        deck
      );
    } else {
      setSelectedIndex(deck.indexOf(-1));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentVote, deck]);

  const selectIndex = (index: number) => {
    console.log("deck " + index);
    if (!isLocked) {
      setSelectedIndex(index);
      updateSelection(deck[index]);
    }
  };

  return (
    <div className="container">
      <div className="row">
        {deck.map((score, index) => (
          <div
            className="col mb-3"
            key={score}
            onClick={() => selectIndex(index)}
          >
            <Card
              key={score}
              value={score}
              canClose={canClose}
              selected={selectedIndex === index}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
