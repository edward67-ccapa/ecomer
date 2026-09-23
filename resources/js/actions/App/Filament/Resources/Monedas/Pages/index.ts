import ListMonedas from './ListMonedas'
import CreateMoneda from './CreateMoneda'
import EditMoneda from './EditMoneda'

const Pages = {
    ListMonedas: Object.assign(ListMonedas, ListMonedas),
    CreateMoneda: Object.assign(CreateMoneda, CreateMoneda),
    EditMoneda: Object.assign(EditMoneda, EditMoneda),
}

export default Pages