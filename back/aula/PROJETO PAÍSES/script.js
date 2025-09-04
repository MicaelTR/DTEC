const bntEnviar = document.getElementById("enviar");
const paisEscolhido = document.getElementById("digitar-país");
const resposta = document.getElementById("container");

bntEnviar.addEventListener("click", () => {
    const pais = paisEscolhido.value.trim();

    if (pais === "") {
        alert("Por favor, Digite o nome do país");
        return;
    }

    const url = `https://restcountries.com/v3.1/name/${pais}`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error("País não encontrado ou erro na API");
            }
            return response.json();
        })
        .then(data => {
            if (!data || data.length === 0) {
                resposta.innerHTML = "<p>País não encontrado. Tente novamente.</p>";
                return;
            }

            const paisInfo = data[0];

            const moedas = paisInfo.currencies ? Object.values(paisInfo.currencies)[0] : null;
            const nomeMoeda = moedas ? moedas.name : "Não disponível";
            const simboloMoeda = moedas ? moedas.symbol : "";


            resposta.innerHTML = `
                <h1>${paisInfo.name.official}</h1>
                <p><strong>Capital:</strong> ${paisInfo.capital ? paisInfo.capital[0] : "Não disponível"}</p>
                <p><strong>População:</strong> ${paisInfo.population}</p>
                <p><strong>Moeda:</strong> ${nomeMoeda}</p>
                <p><strong>Simbolo da moeda: </strong> ${simboloMoeda}</p>

                <img src="${paisInfo.flags.png}" alt="Bandeira de ${paisInfo.name.official}" style="width: 200px;">
            `;
        })
        .catch(error => {
            console.error(error);
            resposta.innerHTML = `<p>${error.message}</p>`;
        });
});
