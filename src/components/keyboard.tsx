import { Component, MouseEventHandler, ReactNode } from "react";
import { Button } from "./ui/button";

export type KeyboardProps = {
  onKeyClick: MouseEventHandler;
};

export default class Keyboard extends Component<any, KeyboardProps> {
  keys = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["Z", "X", "C", "V", "B", "N", "M"],
  ];

  render(): ReactNode {
    const { onKeyClick } = this.props;
    return (
      <div className="flex flex-col justify-center items-center md:hidden">
        {this.keys.map((row, i) => (
          <div className="flex" key={i}>
            {row.map((key, j) => (
              <Button
                id={`key-${key}`}
                size={"icon"}
                variant={"outline"}
                onClick={onKeyClick}
                key={j}
              >
                {key}
              </Button>
            ))}
          </div>
        ))}
      </div>
    );
  }

  componentDidMount(): void {
    document.addEventListener("keyup", this.onKeyup);
  }

  componentWillUnmount(): void {
    document.removeEventListener("keyup", this.onKeyup);
  }

  onKeyup = (e: KeyboardEvent) => {
    const key = e.key.toUpperCase();
    document.getElementById(`key-${key}`)?.click();
  };
}
