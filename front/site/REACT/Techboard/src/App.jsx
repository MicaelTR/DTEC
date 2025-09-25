
import './App.css'

function FormularioDeEvento () {
  return (
    <form className='form-evento'>
      <h2>Criar Evento</h2>
      <fieldset>
        <label htmlFor="">Qual é o nome do evento?</label>
        <input type="text" id="nome" placeholder='Nome do evento'/>
      </fieldset>
    </form>
  )
}

function App() {

  return (
    <main>
      <header>
        <img src="/logo.png" alt="Logo" />
      </header>

      <section>
        <img src="/banner.png" alt="Banner Prinicipal"/>
      </section>
      <FormularioDeEvento> </FormularioDeEvento>
    </main>
  )
}

export default App
