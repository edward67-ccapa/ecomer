import Categorias from './Categorias'
import Dominios from './Dominios'
import Plantillas from './Plantillas'
import Productos from './Productos'
import Sites from './Sites'
import Users from './Users'

const Resources = {
    Categorias: Object.assign(Categorias, Categorias),
    Dominios: Object.assign(Dominios, Dominios),
    Plantillas: Object.assign(Plantillas, Plantillas),
    Productos: Object.assign(Productos, Productos),
    Sites: Object.assign(Sites, Sites),
    Users: Object.assign(Users, Users),
}

export default Resources