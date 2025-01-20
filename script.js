document.getElementById('start-game').addEventListener('click', () => {
    alert('Game Started!');
});
let input = '';
const inputButton = document.getElementById('start-game');

inputButton.addEventListener('mousedown', () => {
    input += '.';
});

inputButton.addEventListener('mouseup', () => {
    console.log('Current Input:', input);
});
if ('vibrate' in navigator) {
    navigator.vibrate([100, 200, 100]); // Vibrates in a pattern
} else {
    console.log('Vibration API not supported on this device.');
}
const chess = new Chess();
console.log(chess.ascii()); // Displays the board
chess.move('e4');          // Makes a move
console.log(chess.fen());  // Displays the current board state
const stockfish = new Worker('https://cdn.jsdelivr.net/gh/niklasf/stockfish.js/stockfish.js'); // Use the local path if downloaded

stockfish.onmessage = (event) => {
    console.log('Stockfish says:', event.data);
};
