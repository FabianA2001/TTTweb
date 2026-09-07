import { Board, CellState } from "../gameLogic/board";
import { renderTicTacToeField } from "../components/tttField/tttField";

export const ticTacToe = () => {
  const board = new Board(3);

  board.setCell(0, 0, CellState.Cross);
  board.setCell(0, 1, CellState.Circle);
  board.setCell(1, 1, CellState.Cross);

  return `
    <section>
      <h1>Tic Tac Toe</h1>
      ${renderTicTacToeField(board)}
    </section>
  `;
};
