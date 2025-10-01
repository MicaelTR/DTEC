import '../FormularioDeEvento/FormularioDeEvento.css'
import { CampoDeEntarda } from '../CampoDeEntrada'
export function FormularioDeEvento () {
    return (
      <form className='form-evento'>
        <TituloFormulario>Criar Evento</TituloFormulario>
        <CampoDeFormulario>
          <Label htmlFor="">Qual é o nome do evento?</Label>
          <input type="text" id="nome" placeholder='Nome do evento'/>
        </CampoDeFormulario>
      </form>
    )
  }