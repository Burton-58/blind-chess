// Initialize Chess.js and Stockfish
const chess = new Chess();
const stockfish = new Worker('https://cdn.jsdelivr.net/gh/niklasf/stockfish.js/stockfish.js');

// Chessboard.js Initialization
const board = Chessboard('board', {
    draggable: true,
    position: 'start',
    onDrop: handleBoardMove
});

// Elements
const statusElement = document.getElementById('status');
const moveInput = document.getElementById('player-move');
const submitMoveButton = document.getElementById('submit-move');

// Text-to-Speech Functionality
const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    speechSynthesis.speak(utterance);
};

// Handle Player Move Input
submitMoveButton.addEventListener('click', () => {
    const move = moveInput.value.trim();
    moveInput.value = '';

    if (playerMove(move)) {
        setTimeout(getAIMove, 1000); // AI moves after a short delay
    }
});

// Handle Moves Made on the Board
function handleBoardMove(source, target) {
    const move = `${source}${target}`;
    if (playerMove(move)) {
        setTimeout(getAIMove, 1000); // AI moves after a short delay
        return true; // Valid move
    } else {
        return 'snapback'; // Invalid move
    }
}

// Player Makes a Move
function playerMove(move) {
    const result = chess.move(move);

    if (result) {
        updateBoard();
        statusElement.textContent = `Player moved: ${move}. AI thinking...`;
        speak(`Player moved ${move}`);
        vibrateFeedback(move);
        return true;
    } else {
        statusElement.textContent = 'Invalid move. Try again!';
        return false;
    }
}

// Get AI Move
function getAIMove() {
    stockfish.postMessage(`position fen ${chess.fen()}`);
    stockfish.postMessage('go depth 10'); // AI difficulty level
}

// Handle Stockfish Response
stockfish.onmessage = (event) => {
    const message = event.data;

    if (message.startsWith('bestmove')) {
        const bestMove = message.split(' ')[1];
        chess.move({ from: bestMove.slice(0, 2), to: bestMove.slice(2, 4) });
        updateBoard();
        statusElement.textContent = `AI moved: ${bestMove}. Your turn!`;
        speak(`AI moved ${bestMove}`);
        vibrateFeedback(bestMove);
    }
};

// Update Chessboard
function updateBoard() {
    board.position(chess.fen());
}

// Vibrate Feedback
function vibrateFeedback(move) {
    if ('vibrate' in navigator) {
        const pattern = moveToVibrationPattern(move);
        navigator.vibrate(pattern);
    }
}

// Convert Moves to Vibration Patterns
function moveToVibrationPattern(move) {
    const base = 100; // Base vibration length
    return move.split('').map(char => base + (char.charCodeAt(0) % 10) * 50);
}
