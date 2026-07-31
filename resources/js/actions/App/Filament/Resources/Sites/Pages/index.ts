import ListSites from './ListSites'
import CreateSite from './CreateSite'
import EditSite from './EditSite'

const Pages = {
    ListSites: Object.assign(ListSites, ListSites),
    CreateSite: Object.assign(CreateSite, CreateSite),
    EditSite: Object.assign(EditSite, EditSite),
}

export default Pages