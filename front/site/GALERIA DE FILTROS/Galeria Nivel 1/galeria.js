const filters = document.getElementById('filters');
const cards = [...document.querySelectorAll('.card')];
let active = 'tudo';

function apply() {
  cards.forEach(card => {
    const match = active === 'tudo' || card.dataset.category === active;
    card.classList.toggle('hidden', !match);
  });
}

filters.addEventListener('click', (e) => {
  const btn = e.target.closest('.pill[data-filter]');
  if (!btn) return;

  filters.querySelectorAll('.pill').forEach(b =>
    b.setAttribute('aria-pressed', 'false')
  );
  btn.setAttribute('aria-pressed', 'true');

  active = btn.dataset.filter;
  apply();
});

apply();
