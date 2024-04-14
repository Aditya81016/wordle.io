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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import Link from "next/link";
import { linkTo } from "@/config";
import { Cross1Icon, Cross2Icon, PauseIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export type PassAndPlayStates = {
  grid: BoxData[][];
  currentPlayer: boolean;
  scores: [number, number];
  selectedBoxId: string;
  words: object;
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
    words: {},
  };

  ScoreBoard = () => {
    const { scores } = this.state;
    return (
      <>
        <div className="flex w-full p-5 justify-between">
          <div>Lefty: {scores[0]}</div>
          <div>Righty: {scores[1]}</div>
        </div>
      </>
    );
  };

  PauseButton = () => {
    const { scores } = this.state;
    return (
      <>
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
      </>
    );
  };

  Log = () => {
    const { words } = this.state;
    return (
      <Accordion type="single" collapsible>
        {Object.keys(words).map((label, i) => (
          <AccordionItem value={String(label)} key={i}>
            <AccordionTrigger>{String(label)}</AccordionTrigger>
            <AccordionContent>
              <div className="max-h-[30vh] overflow-y-scroll">
                {/* @ts-ignore */}
                {words[label]}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    );
  };

  Drawer = () => {
    return (
      <Drawer>
        <DrawerTrigger asChild className="md:hidden">
          <Button>Logs</Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Logs</DrawerTitle>
            <DrawerDescription>
              <this.Log />
            </DrawerDescription>
          </DrawerHeader>
          <DrawerFooter>
            {/* <Button>Submit</Button> */}
            <DrawerClose>
              <Button size="icon" variant="outline">
                <Cross2Icon />
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  };

  render(): ReactNode {
    const { grid, scores, currentPlayer } = this.state;
    return (
      <main className="h-[100dvh] w-full flex justify-center items-center gap-5 p-5">
        <div className="h-full w-full max-w-sm flex flex-col justify-center items-center gap-5">
          <this.ScoreBoard />
          <Board
            grid={grid}
            onBoxClick={this.onBoxClick}
            selectedBox={this.selectedBoxPos}
          />
          <Keyboard onKeyClick={this.onKeyClick} />
          <div className="flex gap-5">
            <this.PauseButton />
            <this.Drawer />
          </div>
        </div>
        <div className="w-full h-full max-md:hidden">
          <Card className="h-full p-5 overflow-y-scroll">
            <div className="text-xl font-bold">Logs</div>
            <this.Log />
          </Card>
        </div>
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
      this.insertWord(horizontalWord);
      const row = this.selectedBoxPos[0];
      const col =
        horizontalString.indexOf(horizontalWord) + horizontalStart + 1;
      for (let i = 0; i < horizontalWord.length; i++) {
        grid[row][col + i].variant = currentPlayer ? "primary" : "secondary";
      }
      this.setState({ grid });
    }
    if (verticalWord !== "") {
      this.insertWord(verticalWord);
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

  insertWord = async (word: string) => {
    const response = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
    ).then(async (res) => await res.json());

    const definitions: string[] = [];
    response.forEach((entry: any) => {
      return entry.meanings.forEach((meaning: any) => {
        meaning.definitions.forEach((definition: any) => {
          definitions.push(definition.definition);
        });
      });
    });

    this.setState({
      words: {
        [word]: (
          <ul className="flex flex-col w-full list-disc list-inside justify-start items-start pl-5">
            {definitions.map((definition: string, i: number) => (
              <li key={i} className="text-xs text-card-foreground/80 text-left">
                {definition}
              </li>
            ))}
          </ul>
        ),
        ...this.state.words,
      },
    });
    console.log(response);
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
