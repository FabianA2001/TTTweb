import { Board, CellState } from "../gameLogic/board";
import { renderTicTacToeField } from "../components/tttField/tttField";
import type { Page } from "./page.ts";

const board = new Board(3);
let refreshPage: (() => void) | null = null;
let isTicTacToeBound = false;

board.setCell(0, 0, CellState.Cross);
board.setCell(0, 1, CellState.Circle);
board.setCell(1, 1, CellState.Cross);

//TODO Gamelogic auslagern
const getNextCellState = (currentState: CellState): CellState => {
  switch (currentState) {
    case CellState.Empty:
      return CellState.Cross;
    case CellState.Cross:
      return CellState.Circle;
    case CellState.Circle:
      return CellState.Empty;
  }
};

export const handleTicTacToeCellClick = (cellIndex: number) => {
  const size = board.getSize();
  const cellCount = size * size;

  if (!Number.isInteger(cellIndex) || cellIndex < 0 || cellIndex >= cellCount) {
    return;
  }

  const row = Math.floor(cellIndex / size);
  const column = cellIndex % size;
  const nextState = getNextCellState(board.getCell(row, column));

  board.setCell(row, column, nextState);
};

const handleTicTacToeClick = (event: MouseEvent) => {
  const target = event.target;

  if (!(target instanceof Element)) {
    return;
  }

  const cell = target.closest("[data-cell-index]");

  if (!(cell instanceof HTMLElement)) {
    return;
  }

  const cellIndex = Number(cell.dataset.cellIndex);

  if (!Number.isInteger(cellIndex)) {
    return;
  }

  handleTicTacToeCellClick(cellIndex);
  refreshPage?.();
};

export const ticTacToe: Page = {
  render: () => {
    return `
      <section>
        <h1>Tic Tac Toe</h1>
        <p>Klicke auf ein Feld, um den State zu ändern und die Seite neu zu rendern.</p>
        ${renderTicTacToeField(board)}
      </section>
    `;
  },
  mount: ({ root, refresh }) => {
    refreshPage = refresh;

    if (isTicTacToeBound) {
      return;
    }

    isTicTacToeBound = true;
    root.addEventListener("click", handleTicTacToeClick);
  },
};
