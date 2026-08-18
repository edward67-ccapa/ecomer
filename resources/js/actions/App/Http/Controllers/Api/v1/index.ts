import PlantillaApiController from './PlantillaApiController'
import ProductoApiController from './ProductoApiController'
import SiteApiController from './SiteApiController'

const v1 = {
    PlantillaApiController: Object.assign(PlantillaApiController, PlantillaApiController),
    ProductoApiController: Object.assign(ProductoApiController, ProductoApiController),
    SiteApiController: Object.assign(SiteApiController, SiteApiController),
}

export default v1