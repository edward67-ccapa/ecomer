import categorias from './categorias'
import colores from './colores'
import dominios from './dominios'
import plantillas from './plantillas'
import productos from './productos'
import sites from './sites'
import subcategorias from './subcategorias'
import tallas from './tallas'
import tiendas from './tiendas'
import users from './users'
import shield from './shield'

const resources = {
    categorias: Object.assign(categorias, categorias),
    colores: Object.assign(colores, colores),
    dominios: Object.assign(dominios, dominios),
    plantillas: Object.assign(plantillas, plantillas),
    productos: Object.assign(productos, productos),
    sites: Object.assign(sites, sites),
    subcategorias: Object.assign(subcategorias, subcategorias),
    tallas: Object.assign(tallas, tallas),
    tiendas: Object.assign(tiendas, tiendas),
    users: Object.assign(users, users),
    shield: Object.assign(shield, shield),
}

export default resources