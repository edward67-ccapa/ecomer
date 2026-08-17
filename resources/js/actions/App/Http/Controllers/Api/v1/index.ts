import PlantillaApiController from './PlantillaApiController'
import SiteApiController from './SiteApiController'
import ProductoApiController from './ProductoApiController'

const v1 = {
    PlantillaApiController: Object.assign(PlantillaApiController, PlantillaApiController),
    SiteApiController: Object.assign(SiteApiController, SiteApiController),
    ProductoApiController: Object.assign(ProductoApiController, ProductoApiController),
}

export default v1