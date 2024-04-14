import { BoxData } from "@/components/box";
import dictionary from "@/lib/words";
// const dictionary: string[] = words;

// @ts-ignore
export function genGrid<T>(row: number, col: number, value: T) {
  if (typeof value !== "object")
    return new Array(row).fill(new Array(col).fill(value));
  else {
    const grid: T[][] = [];
    for (let i = 0; i < row; i++) {
      grid[i] = [];
      for (let j = 0; j < col; j++) {
        grid[i].push(JSON.parse(JSON.stringify(value)));
      }
    }
    return grid;
  }
}

export class GridHelper {
  grid: BoxData[][];
  stringGrid: string[][] = [];
  selectedBoxId: string;

  horizontalStart: number = 0;
  horizontalString: string = "";
  horizontalList: string[] = [];
  horizontalWord: string = "";

  verticalStart: number = 0;
  verticalString: string = "";
  verticalList: string[] = [];
  verticalWord: string = "";

  constructor(grid: BoxData[][], selectedBoxId: string) {
    this.grid = grid;
    this.selectedBoxId = selectedBoxId;

    this.findStringGrid();
    this.findHorizontalString();
    this.findVerticalString();

    this.horizontalList = GridHelper.generateList(
      this.horizontalString,
      this.selectedBoxPos[1] - this.horizontalStart
    );
    this.verticalList = GridHelper.generateList(
      this.verticalString,
      this.selectedBoxPos[0] - this.verticalStart
    );

    for (let i = 0; i < this.horizontalList.length; i++) {
      const word = this.horizontalList[i].toLowerCase();
      if (dictionary.includes(word)) {
        this.horizontalWord = word;
        break;
      } else if (dictionary.includes(reverse(word))) {
        this.horizontalWord = reverse(word);
        break;
      }
    }
    for (let i = 0; i < this.verticalList.length; i++) {
      const word = this.verticalList[i].toLowerCase();
      if (dictionary.includes(word)) {
        this.verticalWord = word;
        break;
      } else if (dictionary.includes(reverse(word))) {
        this.verticalWord = reverse(word);
        break;
      }
    }
  }

  private findStringGrid = () => {
    // creating a grid with just string
    const stringGrid: string[][] = [];
    for (let i = 0; i < this.grid.length; i++) {
      stringGrid.push([]);
      for (let j = 0; j < this.grid[i].length; j++) {
        stringGrid[i].push(this.grid[i][j].value);
      }
    }
    this.stringGrid = stringGrid;
  };

  private findHorizontalString = () => {
    const [x, y] = this.selectedBoxPos;

    let string = this.stringGrid[x][y];

    let col = y;
    while (--col >= 0) {
      if (this.stringGrid[x][col] === " ") break;
      else string = this.stringGrid[x][col] + string;
    }
    this.horizontalStart = col + 1;

    col = y;
    while (++col <= this.stringGrid[x].length) {
      if (this.stringGrid[x][col] === " ") break;
      else string = string + this.stringGrid[x][col];
    }

    this.horizontalString = string;
  };

  private findVerticalString = () => {
    const [x, y] = this.selectedBoxPos;

    let string = this.stringGrid[x][y];

    let row = x;
    while (--row >= 0) {
      if (this.stringGrid[row][y] === " ") break;
      else string = this.stringGrid[row][y] + string;
    }
    this.verticalStart = row + 1;

    row = x;
    while (++row < this.stringGrid.length) {
      if (this.stringGrid[row][y] === " ") break;
      else string = string + this.stringGrid[row][y];
    }

    this.verticalString = string;
  };

  static generateList = (string: string, index: number) => {
    const list = [];
    for (let i = 0; i <= index; i++) {
      for (let j = index; j < string.length; j++) {
        list.push(string.substring(i, j + 1));
      }
    }
    return list.sort((a, b) => b.length - a.length);
  };

  get selectedBox() {
    const pos = this.selectedBoxPos;
    return this.grid[pos[0]][pos[1]];
  }

  get selectedBoxPos() {
    const pos = this.selectedBoxId.replace("box-", "").split("-");
    const numPos = [Number(pos[0]), Number(pos[1])];
    return numPos as [number, number];
  }
}

function reverse(string: string) {
  let gnirts = "";
  for (let i = 0; i < string.length; i++) {
    gnirts = string[i] + gnirts;
  }

  return gnirts;
}

// const evaluate = () => {
//   const box = grid[selectedBox[0]][selectedBox[1]];
//   const vertString = box.value;
//   const horString = box.value;

//   let rowIndex = selectedBox[0];
//   let colIndex = selectedBox[1];
//   while (rowIndex >= 0 && grid[rowIndex - 1][selectedBox[1]].value !== "")
//     // calculates scores
//     const score = [0, 0];
//   for (let i = 0; i < 10; i++) {
//     for (let j = 0; j < 10; j++) {
//       if (grid[i][j].variant === "primary") score[0]++;
//       else if (grid[i][j].variant === "secondary") score[1]++;
//     }
//   }
//   setScores(score as [number, number]);
// };
