'use strict';
const form = document.querySelector('#brief');
const contactInput = document.querySelector('#client-contact');
const consentInput = document.querySelector('#privacy-consent');
consentInput.addEventListener('change', () => {
  if (!consentInput.checked) {
    document.querySelector('#result').hidden = true;
    document.querySelector('#message').value = '';
  }
});
contactInput.addEventListener('input', () => {
  contactInput.setCustomValidity(contactInput.value.trim() ? '' : 'Укажите Telegram или номер телефона.');
});
form.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const data = new FormData(form);
  const contact = data.get('contact').trim();
  if (!contact) {
    contactInput.setCustomValidity('Укажите Telegram или номер телефона.');
    contactInput.reportValidity();
    return;
  }
  document.querySelector('#copy').textContent = 'Скопировать текст';
  document.querySelector('#message').value = `Здравствуйте! Меня зовут ${data.get('name').trim()}.\nМой бизнес: ${data.get('business').trim()}.\nСвязаться со мной: ${contact}\nЗадача: ${data.get('task').trim()}.\nХочу обсудить продвижение на Авито.\n\nДаю согласие Нинель Храмовой на обработку указанных мной персональных данных для ответа на обращение. Условия: https://ninel-khramova-avito.vercel.app/consent (редакция от 20.10.2026).`;
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

// Motion is progressive: content remains readable without JS or with reduced motion.
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const revealElements = [...document.querySelectorAll('[data-reveal], .section-title, .cards > .card, .case-card, .steps > article')];
let revealObserver;
function setupReveals() {
  revealObserver?.disconnect();
  revealElements.forEach((element) => element.classList.remove('will-reveal', 'is-visible'));
  if (reducedMotion.matches || !('IntersectionObserver' in window)) return;
  revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(({ target, isIntersecting }) => {
      if (isIntersecting) {
        target.classList.add('is-visible');
        revealObserver.unobserve(target);
      }
    });
  }, { threshold: 0.08 });
  revealElements.forEach((element) => {
    const siblings = [...element.parentElement.children];
    const stagger = element.matches('.card, .case-card, .steps > article') ? Math.min(siblings.indexOf(element), 3) * 65 : 0;
    element.style.setProperty('--reveal-delay', `${stagger}ms`);
    element.classList.add('will-reveal');
    revealObserver.observe(element);
  });
}
setupReveals();
reducedMotion.addEventListener('change', setupReveals);
const progress = document.querySelector('.reading-progress');
let progressScheduled = false;
function updateProgress() {
  const distance = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.transform = `scaleX(${distance > 0 ? Math.min(1, Math.max(0, window.scrollY / distance)) : 0})`;
  progressScheduled = false;
}
function scheduleProgress() {
  if (!progressScheduled) {
    progressScheduled = true;
    window.requestAnimationFrame(updateProgress);
  }
}
window.addEventListener('scroll', scheduleProgress, { passive: true });
window.addEventListener('resize', scheduleProgress);
window.addEventListener('load', scheduleProgress);
updateProgress();

// Enable only after local form handling is installed; no-JS submissions stay disabled.
document.querySelector("#brief-fields").disabled = false;
