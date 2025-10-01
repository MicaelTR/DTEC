// Exemplo de produtos no carrinho (simulação inicial)
let cart = [
    { id: 1, nome: "Smash Burger", preco: 20.00, quantidade: 1, imagem: "smash.png" },
    { id: 2, nome: "Coca-Cola", preco: 8.00, quantidade: 2, imagem: "coca.jpg" }
  ];
  
  const cartItems = document.getElementById('cart-items');
  const cartTotal = document.getElementById('cart-total');
  
  function renderCart() {
    cartItems.innerHTML = '';
    let total = 0;
  
    cart.forEach(item => {
      const itemTotal = item.preco * item.quantidade;
      total += itemTotal;
  
      const div = document.createElement('div');
      div.className = 'cart-item';
  
      div.innerHTML = `
        <img src="${item.imagem}" alt="${item.nome}">
        <div class="cart-item-info">
          <h3>${item.nome}</h3>
          
          <div class="quantity-control">
            <button onclick="updateQuantity(${item.id}, -1)">
              <span class="material-icons">remove</span>
            </button>
            <input type="text" value="${item.quantidade}" readonly>
            <button onclick="updateQuantity(${item.id}, 1)">
              <span class="material-icons">add</span>
            </button>
          </div>
  
          <div class="price-info">
            <p class="total-price">R$ ${itemTotal.toFixed(2)}</p>
            <p class="unit-price">R$ ${item.preco.toFixed(2)} / unidade</p>
          </div>
  
          <button class="btn-remove" onclick="removeFromCart(${item.id})">
            <span class="material-icons">delete</span> Remover
          </button>
        </div>
      `;
  
      cartItems.appendChild(div);
    });
  
    cartTotal.textContent = total.toFixed(2);
  }
  
  function updateQuantity(id, change) {
    const item = cart.find(p => p.id === id);
    if (!item) return;
    item.quantidade += change;
    if (item.quantidade < 1) item.quantidade = 1;
    renderCart();
  }
  
  function removeFromCart(id) {
    cart = cart.filter(p => p.id !== id);
    renderCart();
  }
  

  renderCart();
  