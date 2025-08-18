const pessoa = {
    nome: "Micael",
    sobrenome: "Tozzi Ribeiro",
    idade: 16,   
}

function criar (nome , sobrenome , idade) {
    return {
        nome,
        sobrenome,
        idade,

        aniv() {
            this.idade += 1
        }
    };
}

const pessoa1 = criar("Micael" , "Tozzi Ribeiro" , 16 ); 