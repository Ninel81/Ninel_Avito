'use strict';
const form = document.querySelector('#brief');
form.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = new FormData(form);
  document.querySelector('#message').value = `Здравствуйте! Меня зовут ${data.get('name').trim()}.\nМой бизнес: ${data.get('business').trim()}.\nЗадача: ${data.get('task').trim()}.\nХочу обсудить продвижение на Авито.`;
  document.querySelector('#result').hidden = false;
  document.querySelector('#message').focus();
});
document.querySelector('#copy').addEventListener('click', async (event) => {
  const button = event.currentTarget;
  const message = document.querySelector('#message');
  try {
    await navigator.clipboard.writeText(message.value);
    button.textContent = 'Скопировано ✓';
  } catch {
    message.focus();
    message.select();
    button.textContent = 'Выделено — нажмите Ctrl+C / ⌘C';
  }
});
