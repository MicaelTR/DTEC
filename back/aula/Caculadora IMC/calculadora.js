const form = document.querySelector('#resposta-user');

form.addEventListener('submit', function (e) {
    e.preventDefault();

    // Variaveis para o calculo
    const peso = parseFloat(document.querySelector("#peso").value);
    const altura = parseFloat(document.querySelector("#altura").value);
    
    // Faixa com resultado
    const resultado = document.querySelector("#resultado");

    if (isNaN(peso) || isNaN(altura) || peso < 0 || altura < 0) {
        resultado.textContent = `Por favor, digite peso e altura com numeros validos!`
        resultado.style.backgroundColor = "red";
        return;
    }

    resultado.style.backgroundColor = "#92ffb3";


    // Variaveis para a conta
    const contaImc = peso / (altura * altura);

    // Armazena o que vai aparecer na faixa com resultado
    let resultadoImc = "";

    if (contaImc <= 18.5) {
        resultadoImc = "Abaixo do peso"
    }
    else if (contaImc > 18.5 && contaImc < 24.9) {
        resultadoImc = "Peso normal";
    }
    else if (contaImc > 24.9 && contaImc <= 29.9) {
        resultadoImc = "Sobrepeso"
    }
    else if (contaImc >= 30 && contaImc <= 34.9) {
        resultadoImc = "Obesidade Grau 1"
    }
    else if (contaImc >= 35 && contaImc <= 39.9) {
        resultadoImc = "Obesidade Grau 2"
    }
    else if (contaImc >= 40) {
        resultadoImc = "Obesidade Grau 3"
    }

    resultado.textContent = `Seu resultado é ${contaImc.toFixed(2)} - ${resultadoImc}!`
});


//----COMPLETAR JS----

//----COMPLETAR JS----

//----COMPLETAR JS----