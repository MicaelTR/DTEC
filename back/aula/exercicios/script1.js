const nome = prompt("Digite seu nome completo: ");

const letras = nome.length;
const letra2 = nome[1];

 

const a1 = nome.indexOf("i");
const a2 = nome.lastIndexOf("i");
const ultimos3 = nome.slice(-3);
const partes = nome.split(" ");
const maior = nome.toUpperCase();
const menor = nome.toLowerCase();

document.body.innerHTML = `<p><strong> Nome: </strong> ${nome} </p>
<p><strong> Quantidades de letras: </strong> ${letras} </p>
<p><strong> Segunda letra I: </strong> ${letra2} </p>
<p><strong> Primeira letra I: </strong> ${a1} </p>
<p><strong> Ultima letra I: </strong> ${a2} </p>
<p><strong> Partes: </strong> ${partes} </p>
<p><strong> Ultimas três letra: </strong> ${ultimos3}</p>
<p><strong> Nome Maiusculo: </strong> ${maior} </p>
<p><strong> Nome Minusculo: </strong> ${menor} </p>`