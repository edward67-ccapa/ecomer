import categorias from './categorias'
import colores from './colores'
import dominios from './dominios'
import monedas from './monedas'
import plantillas from './plantillas'
import productos from './productos'
import shield from './shield'
import sites from './sites'
import subcategorias from './subcategorias'
import tallas from './tallas'
import tiendas from './tiendas'
import users from './users'

const resources = {
    categorias: Object.assign(categorias, categorias),
    colores: Object.assign(colores, colores),
    dominios: Object.assign(dominios, dominios),
    monedas: Object.assign(monedas, monedas),
    plantillas: Object.assign(plantillas, plantillas),
    productos: Object.assign(productos, productos),
    shield: Object.assign(shield, shield),
    sites: Object.assign(sites, sites),
    subcategorias: Object.assign(subcategorias, subcategorias),
    tallas: Object.assign(tallas, tallas),
    tiendas: Object.assign(tiendas, tiendas),
    users: Object.assign(users, users),
}

export default resources