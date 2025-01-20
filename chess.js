// Include the chess.js library. You can download it from https://github.com/jhlywa/chess.js
class Chess {
  constructor() {
    this.game = new ChessJS();
  }

  move(move) {
    const result = this.game.move(move);
    return result !== null; // Returns true if the move is valid
  }

  fen() {
    return this.game.fen();
  }
}
