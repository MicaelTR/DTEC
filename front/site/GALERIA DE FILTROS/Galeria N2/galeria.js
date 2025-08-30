// Seleção de elementos
const filterButtons = document.querySelectorAll('.pill');
const searchInput = document.querySelector('.buscar');
const sortSelect = document.querySelector('.sort');
const clearButton = document.querySelector('.limpar');
const cards = document.querySelectorAll('.card');
const counter = document.getElementById('counter');

// Função para atualizar a exibição das cards
function updateGallery() {
    const activeFilters = Array.from(filterButtons)
        .filter(btn => btn.querySelector('input').checked)
        .map(btn => btn.dataset.filter);

    const searchText = searchInput.value.toLowerCase();
    const sortValue = sortSelect.value;

    let filteredCards = Array.from(cards).filter(card => {
        const title = card.querySelector('strong').textContent.toLowerCase();
        const category = card.dataset.category;
        const isFavorite = card.querySelector('.fav').getAttribute('aria-pressed') === "true";

        const matchesFilter = activeFilters.includes(category);
        const matchesSearch = title.includes(searchText);

        return matchesFilter && matchesSearch;
    });

    // Ordenação
    filteredCards.sort((a, b) => {
        const titleA = a.querySelector('strong').textContent.toLowerCase();
        const titleB = b.querySelector('strong').textContent.toLowerCase();
        const favA = a.querySelector('.fav').getAttribute('aria-pressed') === "true" ? 1 : 0;
        const favB = b.querySelector('.fav').getAttribute('aria-pressed') === "true" ? 1 : 0;

        if (sortValue === "az") return titleA.localeCompare(titleB);
        if (sortValue === "za") return titleB.localeCompare(titleA);
        if (sortValue === "fav") {
            // Favoritos primeiro, depois alfabeticamente
            if (favB !== favA) return favB - favA;
            return titleA.localeCompare(titleB);
        }
    });

    // Atualizar visibilidade
    cards.forEach(card => card.style.display = "none");
    filteredCards.forEach(card => card.style.display = "block");

    // Atualizar contador
    counter.textContent = filteredCards.length;
}

// Eventos para filtros
filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        const checkbox = button.querySelector('input');
        checkbox.checked = !checkbox.checked;
        updateGallery();
    });
});

// Evento para busca
searchInput.addEventListener('input', updateGallery);

// Evento para ordenar
sortSelect.addEventListener('change', updateGallery);

// Limpar filtros
clearButton.addEventListener('click', () => {
    filterButtons.forEach(btn => btn.querySelector('input').checked = true);
    searchInput.value = '';
    sortSelect.value = 'az';
    cards.forEach(card => card.querySelector('.fav').setAttribute('aria-pressed', "false"));
    updateGallery();
});

// Favoritar imagens
cards.forEach(card => {
    const favButton = card.querySelector('.fav');
    favButton.addEventListener('click', () => {
        const isPressed = favButton.getAttribute('aria-pressed') === "true";
        favButton.setAttribute('aria-pressed', !isPressed);
        updateGallery();
    });
});

// Inicializa a galeria
updateGallery();
