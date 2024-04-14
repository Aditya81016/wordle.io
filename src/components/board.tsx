import { MouseEventHandler } from "react";
import { Box, BoxData } from "./box";
import { Card } from "./ui/card";

export type BoardProps = {
  grid: BoxData[][];
  selectedBox: [number, number];
  onBoxClick: MouseEventHandler;
};

export default function Board({ grid, selectedBox, onBoxClick }: BoardProps) {
  return (
    <Card className="flex flex-col">
      {grid.map((row, i) => (
        <div className="flex" key={i}>
          {row.map((box, j) => (
            <Box
              onClick={onBoxClick}
              value={box.value}
              variant={box.variant}
              isSelected={String(selectedBox) == String([i, j])}
              id={`box-${i}-${j}`}
              key={j}
            />
          ))}
        </div>
      ))}
    </Card>
  );
}
