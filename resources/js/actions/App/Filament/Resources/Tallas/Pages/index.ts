import ListTallas from './ListTallas'
import CreateTalla from './CreateTalla'
import EditTalla from './EditTalla'

const Pages = {
    ListTallas: Object.assign(ListTallas, ListTallas),
    CreateTalla: Object.assign(CreateTalla, CreateTalla),
    EditTalla: Object.assign(EditTalla, EditTalla),
}

export default Pages