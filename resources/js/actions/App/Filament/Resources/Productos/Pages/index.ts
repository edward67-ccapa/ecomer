import ListProductos from './ListProductos'
import CreateProducto from './CreateProducto'
import EditProducto from './EditProducto'
const Pages = {
    ListProductos: Object.assign(ListProductos, ListProductos),
CreateProducto: Object.assign(CreateProducto, CreateProducto),
EditProducto: Object.assign(EditProducto, EditProducto),
}

export default Pages