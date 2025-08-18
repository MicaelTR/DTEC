const botaoCard = document.querySelector(".produto-card");
const botaoCard2 = document.querySelector(".produto-card2");
const botaoCard3 = document.querySelector(".produto-card3");
const botaoCard4 = document.querySelector(".produto-card4");
const botaoCard5 = document.querySelector(".produto-card5");
const botaoCard6 = document.querySelector(".produto-card6");
const resultado = document.querySelector(".resultado");

function botaoproduto() {

  const nomeProduto = botaoCard.querySelector(".nomeProduto").textContent;
  const descricao = botaoCard.querySelector(".descricao").textContent;
  const valor = botaoCard.querySelector(".valor").textContent;

  resultado.innerHTML += `<p> ${nomeProduto}, ${descricao}, ${valor}</p>`
}

function botaoproduto2() {

  const nomeProduto2 = botaoCard2.querySelector(".nomeProduto2").textContent;
  const descricao2 = botaoCard2.querySelector(".descricao2").textContent;
  const valor2 = botaoCard2.querySelector(".valor2").textContent;

  resultado.innerHTML += `<p> ${nomeProduto2}, ${descricao2}, ${valor2}</p>`
}

function botaoproduto3() {

  const nomeProduto3 = botaoCard3.querySelector(".nomeProduto3").textContent;
  const descricao3 = botaoCard3.querySelector(".descricao3").textContent;
  const valor3 = botaoCard3.querySelector(".valor3").textContent;

  resultado.innerHTML += `<p> ${nomeProduto3}, ${descricao3}, ${valor3}</p>`
}

function botaoproduto4() {

  const nomeProduto4 = botaoCard4.querySelector(".nomeProduto4").textContent;
  const descricao4 = botaoCard4.querySelector(".descricao4").textContent;
  const valor4 = botaoCard4.querySelector(".valor4").textContent;

  resultado.innerHTML += `<p> ${nomeProduto4}, ${descricao4}, ${valor4}</p>`
}

function botaoproduto5() {

  const nomeProduto5 = botaoCard5.querySelector(".nomeProduto5").textContent;
  const descricao5 = botaoCard5.querySelector(".descricao5").textContent;
  const valor5 = botaoCard5.querySelector(".valor5").textContent;

  resultado.innerHTML += `<p> ${nomeProduto5}, ${descricao5}, ${valor5}</p>`
}

function botaoproduto6() {

  const nomeProduto6 = botaoCard6.querySelector(".nomeProduto6").textContent;
  const descricao6 = botaoCard6.querySelector(".descricao6").textContent;
  const valor6 = botaoCard6.querySelector(".valor6").textContent;

  resultado.innerHTML += `<p> ${nomeProduto6}, ${descricao6}, ${valor6}</p>`
}