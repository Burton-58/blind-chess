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
