
import './App.css'
import { FormularioDeEvento } from './assets/Componetes/CampoDeFormulario/CampoDeEntrada/FormularioDeEvento'


function CampoDeFormulario({children}) {
  return (
    <fieldset>
      {children}
    </fieldset>
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
