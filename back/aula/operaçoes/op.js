 
function validar (idade) {
    if (idade > 0 && idade < 13) {
        fase = "Criança";
        console.log(fase)
    }
    else if (idade > 12 && idade < 18) {
        fase = "Adolescente"
        console.log(fase)
    }
    else if (idade > 17 && idade < 60) {
        fase = "Adulto";
        console.log(fase)
    }
    else if (idade > 60) {
        fase = "Idoso";
        console.log(fase)
    }
    else {
        console.log("Digite uma idade verdadeira!")
    }

    return fase
}   


const idade = Number(prompt("Digite sua idade: "));

resultado = validar(idade);
alert(`Fase da vida ${resultado}`)

