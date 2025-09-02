const bntEnviar = document.getElementById(".enviar");
const resposta = document.getElementById(".container");


bntEnviar.addEventListener("click", () => {
    const paisEscolhido = document.getElementById(".digitar-país").value.trim()

    if (paisEscolhido === " ") {
        alert("Por favor, Digite o nome do país")
        return;
    }

    const url = `https://restcountries.com/v3.1/name/${paisEscolhido}`

    fetch(url)
        .then(response => {
            return response.json();
        })

        .then(data => {
            console.log(data)
            const pais = data[0]

            resposta.innerHTML = `
                <h1>${paisEscolhido.name.official}</h1>`
        })
})



