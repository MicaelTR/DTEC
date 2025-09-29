// Elementos do DOM
const productForm = document.getElementById('addProductForm');
const btnListProducts = document.getElementById('btnListProducts');

// Modal
const editModal = document.getElementById('editModal');
const editForm = document.getElementById('editProductForm');
const btnCancelEdit = document.getElementById('btnCancelEdit');

// Utilidades
function getProducts() {
    return JSON.parse(localStorage.getItem('products') || '[]');
}

function saveProducts(products) {
    localStorage.setItem('products', JSON.stringify(products));
}

function generateId() {
    return Date.now();
}

function clearForm(form) {
    form.reset();
}

// Renderizar produtos nas seções fixas
function renderProducts() {
    const products = getProducts();

    const categorias = ['bebidas', 'sanduiches', 'sobremesas'];

    // Limpar conteúdo de cada seção antes de preencher
    categorias.forEach(cat => {
        const section = document.querySelector(`.cards-grid[data-categoria="${cat}"]`);
        if (section) section.innerHTML = '';
    });

    // Criar cards e inserir nas seções correspondentes
    products.forEach(product => {
        const section = document.querySelector(`.cards-grid[data-categoria="${product.categoria}"]`);
        if (!section) return;

        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img src="${product.imagem}" alt="${product.nome}" class="product-image">
            <div class="product-info">
                <h3>${product.nome}</h3>
                <p><strong>Preço:</strong> R$ ${parseFloat(product.preco).toFixed(2)}</p>
                <p>${product.descricao}</p>
                <div class="card-btns">
                    <button onclick="editProduct(${product.id})">Editar</button>
                    <button onclick="deleteProduct(${product.id})">Excluir</button>
                </div>
            </div>
        `;
        section.appendChild(card);
    });
}

// Adicionar produto
productForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const nome = document.getElementById('productName').value;
    const preco = document.getElementById('productPrice').value;
    const imagem = document.getElementById('productImage').value;
    const categoria = document.getElementById('productCategory').value;
    const descricao = document.getElementById('productDescription').value;

    const novoProduto = {
        id: generateId(),
        nome,
        preco,
        imagem,
        categoria,
        descricao
    };

    const produtos = getProducts();
    produtos.push(novoProduto);
    saveProducts(produtos);
    renderProducts();
    clearForm(productForm);
});

// Excluir produto
function deleteProduct(id) {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return;

    let produtos = getProducts();
    produtos = produtos.filter(p => p.id !== id);
    saveProducts(produtos);
    renderProducts();
}

// Editar produto (abrir modal)
function editProduct(id) {
    const produtos = getProducts();
    const produto = produtos.find(p => p.id === id);
    if (!produto) return;

    // Preencher os campos do modal
    document.getElementById('editProductId').value = produto.id;
    document.getElementById('editProductName').value = produto.nome;
    document.getElementById('editProductPrice').value = produto.preco;
    document.getElementById('editProductImage').value = produto.imagem;
    document.getElementById('editProductCategory').value = produto.categoria;
    document.getElementById('editProductDescription').value = produto.descricao;

    editModal.style.display = 'flex'; // Exibir modal
}

// Cancelar edição
btnCancelEdit.addEventListener('click', () => {
    editModal.style.display = 'none';
    clearForm(editForm);
});

// Salvar edição
editForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const id = parseInt(document.getElementById('editProductId').value);
    const nome = document.getElementById('editProductName').value;
    const preco = document.getElementById('editProductPrice').value;
    const imagem = document.getElementById('editProductImage').value;
    const categoria = document.getElementById('editProductCategory').value;
    const descricao = document.getElementById('editProductDescription').value;

    const produtos = getProducts();
    const index = produtos.findIndex(p => p.id === id);
    if (index !== -1) {
        produtos[index] = { id, nome, preco, imagem, categoria, descricao };
        saveProducts(produtos);
        renderProducts();
        editModal.style.display = 'none';
        clearForm(editForm);
    }
});

// Botão "Listar Produtos"
btnListProducts.addEventListener('click', renderProducts);

// Fecha modal ao clicar fora dele
window.addEventListener('click', function (event) {
    if (event.target === editModal) {
        editModal.style.display = 'none';
        clearForm(editForm);
    }
});
