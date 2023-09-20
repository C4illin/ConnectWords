const socket = io('/join');
const sessionId = window.location.pathname.split('/').pop();
const form = document.querySelector('.word-form form');
const word1Input = document.getElementById('word1');
const word2Input = document.getElementById('word2');
const strengthInput = document.getElementById('strength');

socket.emit('sessionId', sessionId);

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const word1 = word1Input.value.trim();
  const word2 = word2Input.value.trim();
  const strength = parseInt(strengthInput.value);
  if (word1 && word2 && strength) {
    socket.emit('word', { sessionId, word1, word2, strength });
    word1Input.value = '';
    word2Input.value = '';
    strengthInput.value = '1';
  }
});