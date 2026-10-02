import { Router } from 'express'
import { authRouter } from '../modules/auth/auth.routes'
import { productRouter } from '../modules/products/product.routes'
import { logRouter } from '../modules/logs/log.routes'
import { createModulePlaceholderRouter } from './module-placeholder.routes'

const apiRouter = Router()

apiRouter.use('/auth', authRouter)
apiRouter.use('/products', productRouter)
apiRouter.use('/logs', logRouter)

const placeholderModules = [
  'users',
  'categories',
  'inventory',
  'cart',
  'wishlist',
  'orders',
  'payments',
  'shipping',
  'notifications',
  'reviews',
  'coupons',
  'promotions',
  'returns',
  'refunds',
  'customer-support',
  'cms',
  'analytics',
]

for (const moduleName of placeholderModules) {
  apiRouter.use(`/${moduleName}`, createModulePlaceholderRouter(moduleName))
}

export { apiRouter }