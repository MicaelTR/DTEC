const form = document.querySelector(".formulario")
const resultado = document.querySelector(".resultado")

form.addEventListener("submit" , function(event){
    event.preventDefault();
    
    const nome = form.querySelector(".nome").value
    const sobrenome = form.querySelector(".sobrenome").value
    const idade = form.querySelector(".idade").value
    const telefone = form.querySelector(".telefone").value  

    resultado.innerHTML += `<p> <strong> Nome: </strong> ${nome} , <strong> Sobrenome: </strong> ${sobrenome} , <strong> Idade: </strong> ${idade} , <strong> Telefone: </strong> ${telefone} </p>`;
    form.reset()
})