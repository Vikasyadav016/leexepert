import { Router } from 'express'
import { authenticate, requireRoles } from '../../middleware/auth.middleware'
import { uploadProductImage } from '../../middleware/image-upload.middleware'
import { withControllerLogging } from '../../middleware/execution-logger.middleware'
import { createProduct, listProducts, productImageUploaded } from './product.controller'

const productRouter = Router()
const catalogManagers = [authenticate, requireRoles('catalog_manager', 'admin')]

productRouter.get('/', withControllerLogging('products', 'list', listProducts))
productRouter.post('/images', ...catalogManagers, uploadProductImage, withControllerLogging('products', 'uploadImage', productImageUploaded))
productRouter.post('/', ...catalogManagers, withControllerLogging('products', 'create', createProduct))

export { productRouter }