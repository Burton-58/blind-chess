const button = document.getElementById("chess-button");
const status = document.getElementById("status");
const moveDisplay = document.getElementById("move");
const botMoveDisplay = document.getElementById("bot-move");

let moveBuffer = [];
let listening = false;

// Initialize Stockfish
const stockfish = new Worker("stockfish.js");
stockfish.postMessage("uci");

// Initialize Chess.js
const chess = new Chess();

button.addEventListener("click", () => {
  if (!listening) {
    listening = true;
    status.textContent = "Input your move by clicking...";
    moveBuffer = [];
    setTimeout(processMove, 5000); // Wait 5 seconds for input
  } else {
    moveBuffer.push(1); // Record a click as "1"
  }
});

function processMove() {
  listening = false;

  const move = decodeMove(moveBuffer);
  if (chess.move(move)) {
    moveDisplay.textContent = `Last move: ${move}`;
    status.textContent = "Processing bot's move...";

    // Send position to Stockfish
    stockfish.postMessage(`position fen ${chess.fen()}`);
    stockfish.postMessage("go depth 15");
  } else {
    status.textContent = "Invalid move. Try again!";
    moveBuffer = [];
  }
}

stockfish.onmessage = (event) => {
  if (event.data.startsWith("bestmove")) {
    const botMove = event.data.split(" ")[1];
    chess.move(botMove);
    botMoveDisplay.textContent = `Bot move: ${botMove}`;
    status.textContent = "Your turn!";
  }
};

function decodeMove(buffer) {
  // Example decoding: hardcoded for simplicity
  // e.g., [5, 2, 5, 4] → "e2e4"
  if (buffer.length === 8) return "e2e4";
  if (buffer.length === 6) return "d2d4";
  return null; // Invalid move
}
