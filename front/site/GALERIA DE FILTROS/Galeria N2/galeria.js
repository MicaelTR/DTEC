const filters = document.getElementById('filters');
const cards = [...document.querySelectorAll('.card')];

const buscarInput = document.querySelector('.buscar');
const limparButton = document.querySelector('.limpar');

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



function filtrarImagens() {
  const buscaTexto = buscarInput.value.toLowerCase();
  cards.forEach(card => {
    const titulo = card.querySelector('.meta').textContent.toLowerCase(); 
    if (titulo.includes(buscaTexto)) {
      card.style.display = 'block';
    }
    
    else {
      card.style.display = 'none';
    }
  });
}

buscarInput.addEventListener('input', filtrarImagens);

limparButton.addEventListener('click', () => {
  buscarInput.value = '';
  filtrarImagens();
});

