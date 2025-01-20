const button = document.getElementById("chess-button");
const status = document.getElementById("status");
const moveDisplay = document.getElementById("move");
const botMoveDisplay = document.getElementById("bot-move");

let moveBuffer = [];
let listening = false;

// Initialize Stockfish
const stockfish = new Worker("stockfish.js");
stockfish.postMessage("uci");

const chess = new Chess(); // Using the Chess.js library for move validation

button.addEventListener("click", () => {
  if (!listening) {
    listening = true;
    status.textContent = "Input your move by clicking...";
    moveBuffer = [];
    setTimeout(processMove, 5000); // Wait 5 seconds for input
  } else {
    moveBuffer.push("1"); // Record each click as a part of the input
  }
});

function processMove() {
  listening = false;
  const move = decodeMove(moveBuffer);
  if (chess.move(move)) {
    moveDisplay.textContent = `Last move: ${move}`;
    stockfish.postMessage(`position fen ${chess.fen()}`);
    stockfish.postMessage("go depth 15");
  } else {
    status.textContent = "Invalid move. Try again!";
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
  // Map buffer to chess notation (e.g., e2e4)
  // Simplified decoding for testing
  const clicks = buffer.length;
  return clicks === 8 ? "e2e4" : "d2d4"; // Replace with proper logic
}
