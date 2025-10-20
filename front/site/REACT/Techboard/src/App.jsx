
import './App.css'
import { FormularioDeEvento } from './assets/Componetes/FormularioDeEvento'


function App() {

  const temas = [

  ]

  const eventos = [

  ]

  function adicionarEvento(evento) {
    eventos.push(evento)
    console.log("eventos =>" , eventos)
  }

  return (
    <main>
      <header>
        <img src="/logo.png" alt="Logo" />
      </header>

      <Banner/>

      <FormularioDeEvento temas={temas} aoSubmeter={adicionarEvento}> </FormularioDeEvento>
    </main>
  )
}

export default App
