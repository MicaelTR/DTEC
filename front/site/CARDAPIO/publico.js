//Endereço da API onde os produtos serão buscados.
const apiUrl = 'http://localhost:3001/produtos';

//Onde os elementos são pegos pelo DOM.
const orderModal = document.getElementById('orderModal');
const orderForm = document.getElementById('orderForm');
const btnCancelOrder = document.getElementById('btnCancelOrder');
const modalProductName = document.getElementById('modalProductName');
const orderProductId = document.getElementById('orderProductId');

//Novos elementos para quantidade
const btnDecrease = document.getElementById('btnDecrease');
const btnIncrease = document.getElementById('btnIncrease');
const productQuantity = document.getElementById('productQuantity');

//Função para renderizar os produtos na tela.
async function renderProducts() {
    try {
        const res = await fetch(apiUrl); //await transforma em um valor de retorno.
        const products = await res.json();

        ['bebidas', 'sanduiches', 'sobremesas'].forEach(cat => {
            const section = document.querySelector(`.cards-grid[data-categoria="${cat}"]`);
            if (section) section.innerHTML = '';
        }); //Limpa as seções antes de renderizar novos produtos.

        products.forEach(product => {
            const section = document.querySelector(`.cards-grid[data-categoria="${product.categoria}"]`);
            if (!section) return; //Separa os produtos por categoria.

            const card = document.createElement('div');
            card.className = 'product-card';

            // Criação da imagem
            const img = document.createElement('img');
            img.src = product.imagem;
            img.alt = product.nome;
            img.className = 'product-image';

            // Criação do container de informações
            const info = document.createElement('div');
            info.className = 'product-info';
            info.innerHTML = `
                <h3>${product.nome}</h3>
                <p><strong>Preço:</strong> R$ ${parseFloat(product.preco).toFixed(2)}</p>
                <p>${product.descricao}</p>
            `;

            // Botão Selecionar
            const btn = document.createElement('button');
            btn.textContent = 'Selecionar';
            btn.addEventListener('click', () => openOrderModal(product));

            info.appendChild(btn);
            card.appendChild(img);
            card.appendChild(info);
            section.appendChild(card);
        }); //Cria o card, e, quando o botão é clicado, passa os dados do produto.

    } catch (error) {
        alert('Erro ao carregar os produtos.');
        console.error(error);
    }
}

function openOrderModal(product) {
    // product já é objeto
    modalProductName.textContent = `Selecionar: ${product.nome}`;
    orderProductId.value = product.id;
    if (productQuantity) productQuantity.value = 1; //Sempre começa em 1
    orderModal.style.display = 'flex';
}//Abre modal de pedido.

//Controle da quantidade com + e -
if (btnDecrease && btnIncrease && productQuantity) {
    btnDecrease.addEventListener('click', () => {
        let value = parseInt(productQuantity.value);
        if (value > 1) {
            productQuantity.value = value - 1;
        }
    });

    btnIncrease.addEventListener('click', () => {
        let value = parseInt(productQuantity.value);
        productQuantity.value = value + 1;
    });
}

btnCancelOrder.addEventListener('click', () => {
    orderModal.style.display = 'none';
    orderForm.reset();
});//Fecha o modal e "cancela" o pedido.

orderForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const pedido = {
        produtoId: orderProductId.value,
        tamanho: document.getElementById('productSize').value,
        quantidade: parseInt(productQuantity.value), //Quantidade adicionada
        observacao: document.getElementById('productNote').value
    };

    console.log('Pedido enviado:', pedido);
    alert('Produto adicionado ao carrinho!');
    orderForm.reset();
    orderModal.style.display = 'none';

});//Submete o pedido (simulado).

window.addEventListener('click', (e) => {
    if (e.target === orderModal) {
        orderModal.style.display = 'none';
        orderForm.reset();
    }
});//Se o usuário clicar fora do modal, ele fecha.

renderProducts();
