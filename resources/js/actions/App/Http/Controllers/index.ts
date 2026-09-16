import Api from './Api'
import PlantillasController from './PlantillasController'
import SitePageController from './SitePageController'

const Controllers = {
    Api: Object.assign(Api, Api),
    PlantillasController: Object.assign(PlantillasController, PlantillasController),
    SitePageController: Object.assign(SitePageController, SitePageController),
}

export default Controllers