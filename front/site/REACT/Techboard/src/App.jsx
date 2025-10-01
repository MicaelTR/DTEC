
import './App.css'
import { FormularioDeEvento } from './assets/Componetes/CampoDeFormulario/CampoDeEntrada/FormularioDeEvento'

function Label ({children, htmlFor}) {
  return (
    <label htmlFor={htmlFor}>
      {children}
    </label>
  )
}
function CampoDeFormulario({children}) {
  return (
    <fieldset>
      {children}
    </fieldset>
  )
}

function TituloFormulario(props) {
  return (
    <h2> {props.children} </h2>
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
