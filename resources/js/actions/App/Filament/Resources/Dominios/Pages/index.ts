import ListDominios from './ListDominios'
import CreateDominio from './CreateDominio'
import EditDominio from './EditDominio'

const Pages = {
    ListDominios: Object.assign(ListDominios, ListDominios),
    CreateDominio: Object.assign(CreateDominio, CreateDominio),
    EditDominio: Object.assign(EditDominio, EditDominio),
}

export default Pages