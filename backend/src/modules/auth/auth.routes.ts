import { Router } from 'express'
import { signIn, signUp } from './auth.controller'
import { signInRateLimiter, signUpRateLimiter } from '../../middleware/rate-limit.middleware'
import { withControllerLogging } from '../../middleware/execution-logger.middleware'

const authRouter = Router()

authRouter.post('/signup', signUpRateLimiter, withControllerLogging('auth', 'signUp', signUp))
authRouter.post('/signin', signInRateLimiter, withControllerLogging('auth', 'signIn', signIn))

export { authRouter }