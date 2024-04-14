"use client";

import Board from "@/components/board";
import { BoxData, boxVariants } from "@/components/box";
import Keyboard from "@/components/keyboard";
import { Component, MouseEventHandler, ReactNode } from "react";
import { GridHelper, genGrid } from "./utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Link from "next/link";
import { linkTo } from "@/config";
import { PauseIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";

export type PassAndPlayStates = {
  grid: BoxData[][];
  currentPlayer: boolean;
  scores: [number, number];
  selectedBoxId: string;
};

export default class PassAndPlay extends Component<any, PassAndPlayStates> {
  row = 10;
  col = 10;
  state = {
    grid: genGrid<BoxData>(this.row, this.col, {
      value: " ",
      variant: "default",
    }),
    currentPlayer: false,
    scores: [0, 0] as [number, number],
    selectedBoxId: "box-0-0",
  };

  render(): ReactNode {
    const { grid, scores, currentPlayer } = this.state;
    return (
      <main className="h-[100dvh] w-full flex flex-col justify-center items-center gap-5 p-5">
        <div className="flex w-full p-5 justify-between">
          <div>Lefty: {scores[0]}</div>
          <div>Righty: {scores[1]}</div>
        </div>
        <Board
          grid={grid}
          onBoxClick={this.onBoxClick}
          selectedBox={this.selectedBoxPos}
        />
        <Keyboard onKeyClick={this.onKeyClick} />

        {/* Pause */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button size={"icon"} variant={"outline"}>
              <PauseIcon />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Game Paused</AlertDialogTitle>
              <AlertDialogDescription>
                {scores[0] === scores[1]
                  ? "Neither"
                  : scores[0] > scores[1]
                  ? "Lefty"
                  : "Righty"}{" "}
                is winning!
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Back</AlertDialogCancel>
              <AlertDialogAction>
                <Link href={linkTo.home} className="h-full w-full">
                  Home
                </Link>
              </AlertDialogAction>
              <AlertDialogAction>
                <Link
                  href={linkTo.redirect + linkTo.passAndPlay}
                  className="h-full w-full"
                >
                  Restart
                </Link>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Game Over */}
        <AlertDialog>
          <AlertDialogTrigger id="game-over-trigger" className="hidden">
            Open
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Game Over</AlertDialogTitle>
              <AlertDialogDescription>
                {scores[0] > scores[1] ? "Lefty" : "Righty"} Won!
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>
                <Link href={linkTo.home} className="h-full w-full">
                  Home
                </Link>
              </AlertDialogCancel>
              <AlertDialogAction>
                <Link
                  href={linkTo.redirect + linkTo.passAndPlay}
                  className="h-full w-full"
                >
                  Play Again
                </Link>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* <Button size={"max"}>Submit</Button> */}
      </main>
    );
  }

  onBoxClick: MouseEventHandler = (e) => {
    console.log("clicked");
    const target = e.currentTarget;
    const [i, j] = target.id.replace("box-", "").split("-");
    this.setState({
      selectedBoxId: `box-${i}-${j}`,
    });
  };

  onKeyClick: MouseEventHandler = (e) => {
    const { grid } = this.state;
    const target = e.currentTarget;
    const key = target.id.replace("key-", "");

    const box = this.selectedBox;

    // game progresses here...
    if (box.value === " ") {
      box.value = key;
      this.setState({ grid });

      this.evaluate();

      // swap players
      this.setState({
        currentPlayer: !this.state.currentPlayer,
      });
    }
  };

  evaluate = () => {
    const { grid, selectedBoxId, currentPlayer } = this.state;
    const helper = new GridHelper(grid, selectedBoxId);
    const {
      horizontalString,
      horizontalWord,
      horizontalStart,
      verticalString,
      verticalWord,
      verticalStart,
    } = helper;
    if (horizontalWord !== "") {
      const row = this.selectedBoxPos[0];
      const col =
        horizontalString.indexOf(horizontalWord) + horizontalStart + 1;
      for (let i = 0; i < horizontalWord.length; i++) {
        grid[row][col + i].variant = currentPlayer ? "primary" : "secondary";
      }
      this.setState({ grid });
    }
    if (verticalWord !== "") {
      const col = this.selectedBoxPos[1];
      const row = verticalString.indexOf(verticalWord) + verticalStart + 1;
      for (let i = 0; i < verticalWord.length; i++) {
        grid[row + i][col].variant = currentPlayer ? "primary" : "secondary";
      }
      this.setState({ grid });
    }
    const score = [0, 0];
    for (let i = 0; i < this.row; i++) {
      for (let j = 0; j < this.col; j++) {
        if (grid[i][j].variant === "primary") score[0]++;
        else if (grid[i][j].variant === "secondary") score[1]++;
      }
    }
    this.setState({ scores: score as [number, number] });

    // check game over
    if (
      grid.find((col) => col.find((box: BoxData) => box.value === " ")) ===
      undefined
    ) {
      this.gameOver();
    }
  };

  gameOver = () => {
    document.getElementById("game-over-trigger")?.click();
  };

  get selectedBox() {
    const pos = this.selectedBoxPos;
    return this.state.grid[pos[0]][pos[1]];
  }

  get selectedBoxPos() {
    const pos = this.state.selectedBoxId.replace("box-", "").split("-");
    const numPos = [Number(pos[0]), Number(pos[1])];
    return numPos as [number, number];
  }
}
