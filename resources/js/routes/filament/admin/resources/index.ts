import categorias from './categorias'
import dominios from './dominios'
import plantillas from './plantillas'
import productos from './productos'
import sites from './sites'
import users from './users'
import shield from './shield'

const resources = {
    categorias: Object.assign(categorias, categorias),
    dominios: Object.assign(dominios, dominios),
    plantillas: Object.assign(plantillas, plantillas),
    productos: Object.assign(productos, productos),
    sites: Object.assign(sites, sites),
    users: Object.assign(users, users),
    shield: Object.assign(shield, shield),
}

export default resources