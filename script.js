'use strict';
const form = document.querySelector('#brief');
form.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = new FormData(form);
  document.querySelector('#message').value = `Здравствуйте! Меня зовут ${data.get('name').trim()}.\nМой бизнес: ${data.get('business').trim()}.\nГород: ${data.get('city').trim()}.\nПрофиль: ${data.get('profile').trim() || 'Пришлю в чате'}.\nЗадача: ${data.get('task').trim()}.\nХочу получить бесплатный разбор профиля на Авито.`;
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

const checks = Array.from(document.querySelectorAll('.audit-check'));
checks.forEach(check => check.addEventListener('change', () => {
  const count = checks.filter(item => item.checked).length;
  document.querySelector('#audit-score').textContent = 'Отмечено ' + count + ' из ' + checks.length + ' пунктов';
  document.querySelector('#audit-tip').textContent = count === checks.length ? 'Базовое оформление проверено. Следующий шаг — сопоставить просмотры, обращения и расходы.' : 'Вернитесь к неотмеченным пунктам. Если сложно понять, что исправить, пришлите профиль на бесплатный разбор.';
}));
