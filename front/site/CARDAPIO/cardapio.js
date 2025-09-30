const productForm = document.getElementById('addProductForm');
const btnListProducts = document.getElementById('btnListProducts');

const editModal = document.getElementById('editModal');
const editForm = document.getElementById('editProductForm');
const btnCancelEdit = document.getElementById('btnCancelEdit');// Itens pegos no HTML.


const API_URL = "http://localhost:3001/produtos";//Rota que guarda os produtos.

function clearForm(form) {
    form.reset();
}//Limpa os campos do formulário.

async function getProducts() {
    const response = await fetch(API_URL);
    return await response.json();
}//Pega os produtos da API.

//Renderiza os produtos nas seções fixas.
async function renderProducts() {
    const products = await getProducts();
    const categorias = ['bebidas', 'sanduiches', 'sobremesas'];

    categorias.forEach(cat => {
        const section = document.querySelector(`.cards-grid[data-categoria="${cat}"]`);
        if (section) section.innerHTML = '';
    });

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
}//Pega produtos da API, limpa as seções e renderiza os produtos em cards.

// Adiciona o produto.
productForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const nome = document.getElementById('productName').value;
    const preco = document.getElementById('productPrice').value;
    const imagem = document.getElementById('productImage').value;
    const categoria = document.getElementById('productCategory').value;
    const descricao = document.getElementById('productDescription').value;

    const novoProduto = { nome, preco, imagem, categoria, descricao };

    await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novoProduto)
    });

    await renderProducts();
    clearForm(productForm);
});//Pega valores do formulário, cria um objeto e envia pra API, e depois, atualiza a lista de produtos e limpa o formulário.

//Exclui o produto.
async function deleteProduct(id) {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return;

    await fetch(`${API_URL}/${id}`, {
        method: "DELETE"
    });

    await renderProducts();
}//Pede confirmação, exclui o produto pela API e atualiza a lista de produtos.

//Editar o produto  / abrir o modal.
async function editProduct(id) {
    const response = await fetch(`${API_URL}/${id}`);
    const produto = await response.json();

    if (!produto) return;

    document.getElementById('editProductId').value = produto.id;
    document.getElementById('editProductName').value = produto.nome;
    document.getElementById('editProductPrice').value = produto.preco;
    document.getElementById('editProductImage').value = produto.imagem;
    document.getElementById('editProductCategory').value = produto.categoria;
    document.getElementById('editProductDescription').value = produto.descricao;

    editModal.style.display = 'flex';
}//Busca o produto pela API, preenche o formulário do modal e abre o modal.

//Cancelar edição
btnCancelEdit.addEventListener('click', () => {
    editModal.style.display = 'none';
    clearForm(editForm);
});//Fecha o modal e limpa o formulário.

//Salva edição.
editForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const id = parseInt(document.getElementById('editProductId').value);
    const nome = document.getElementById('editProductName').value;
    const preco = document.getElementById('editProductPrice').value;
    const imagem = document.getElementById('editProductImage').value;
    const categoria = document.getElementById('editProductCategory').value;
    const descricao = document.getElementById('editProductDescription').value;

    const produtoAtualizado = { nome, preco, imagem, categoria, descricao };

    await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(produtoAtualizado)
    });

    await renderProducts();
    editModal.style.display = 'none';
    clearForm(editForm);
});//Pega os dados do  modal, cria um novo objeto, atualiza, fecha o modal e limpa o formulário.

btnListProducts.addEventListener('click', renderProducts);//Lista os produtos.

window.addEventListener('click', function (event) {
    if (event.target === editModal) {
        editModal.style.display = 'none';
        clearForm(editForm);
    }
});//Se o usuário clicar fora do modal ele é fechado.