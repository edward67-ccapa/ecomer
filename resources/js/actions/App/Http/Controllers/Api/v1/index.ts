import PlantillaApiController from './PlantillaApiController'
import ProductoApiController from './ProductoApiController'
import SiteApiController from './SiteApiController'
import TikTokApiController from './TikTokApiController'

const v1 = {
    PlantillaApiController: Object.assign(PlantillaApiController, PlantillaApiController),
    ProductoApiController: Object.assign(ProductoApiController, ProductoApiController),
    SiteApiController: Object.assign(SiteApiController, SiteApiController),
    TikTokApiController: Object.assign(TikTokApiController, TikTokApiController),
}

export default v1