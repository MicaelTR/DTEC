fetch("https://pokeapi.co/api/v2/pokemon/25")
.then(response => {
    return response.json()
})

.then(data => {
    console.log(data.name)
})