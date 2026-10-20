'use strict';
const form = document.querySelector('#brief');
const contactInput = document.querySelector('#client-contact');
contactInput.addEventListener('input', () => {
  contactInput.setCustomValidity(contactInput.value.trim() ? '' : 'Укажите Telegram или номер телефона.');
});
form.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const contact = data.get('contact').trim();
  if (!contact) {
    contactInput.setCustomValidity('Укажите Telegram или номер телефона.');
    contactInput.reportValidity();
    return;
  }
  document.querySelector('#copy').textContent = 'Скопировать текст';
  document.querySelector('#message').value = `Здравствуйте! Меня зовут ${data.get('name').trim()}.\nМой бизнес: ${data.get('business').trim()}.\nСвязаться со мной: ${contact}\nЗадача: ${data.get('task').trim()}.\nХочу обсудить продвижение на Авито.`;
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

const checklistItems = document.querySelectorAll('.checklist-items input[type="checkbox"]');
checklistItems.forEach((item) => item.addEventListener('change', () => {
  const count = [...checklistItems].filter((input) => input.checked).length;
  document.querySelector('#checklist-status').textContent = `Проверено ${count} из ${checklistItems.length} пунктов. ${count === checklistItems.length ? 'Теперь сравните просмотры и обращения. Если вопросы остались — начните с бесплатного разбора.' : 'Отметьте проверенные пункты; недостающие можно обсудить на разборе.'}`;
}));
