import '../FormularioDeEvento/FormularioDeEvento.css'
import { CampoDeEntarda } from '../../CampoDeEntrada'
import { CampoDeFormulario } from '../../../CampoDeFormulario'
import { Label } from '../../../Label'
import { TituloFormulario } from '../../../TituloFormulario'

export function FormularioDeEvento () {
    return (
      <form className='form-evento'>
        <TituloFormulario>
          Criar Evento
        </TituloFormulario>
        <CampoDeFormulario>
          <Label htmlFor="">Qual é o nome do evento?</Label>
          <CampoDeEntarda type="text" id="nome" placeholder='Nome do evento'/>
        </CampoDeFormulario>
      </form>
    )
  }