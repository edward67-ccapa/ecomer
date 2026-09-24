import ListMarcas from './ListMarcas'
import CreateMarca from './CreateMarca'
import EditMarca from './EditMarca'

const Pages = {
    ListMarcas: Object.assign(ListMarcas, ListMarcas),
    CreateMarca: Object.assign(CreateMarca, CreateMarca),
    EditMarca: Object.assign(EditMarca, EditMarca),
}

export default Pages