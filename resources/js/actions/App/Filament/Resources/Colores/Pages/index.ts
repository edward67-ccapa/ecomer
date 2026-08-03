import ListColores from './ListColores'
import CreateColor from './CreateColor'
import EditColor from './EditColor'

const Pages = {
    ListColores: Object.assign(ListColores, ListColores),
    CreateColor: Object.assign(CreateColor, CreateColor),
    EditColor: Object.assign(EditColor, EditColor),
}

export default Pages