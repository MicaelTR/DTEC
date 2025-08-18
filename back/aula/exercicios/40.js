function pessoa (nome , idade , profissao) {
    return {
        nome,
        idade,
        profissao,

        apresentar() {
            console.log(`Olá meu nome é ${this.nome} tenho ${this.idade} anos e minha profissão atual é ${this.profissao}!`)
        }
    }
}
const p1 = pessoa("Micael" , 16 , "Programdor iniciante")
const p1Ap = p1.apresentar();

