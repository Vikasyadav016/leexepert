import { Router } from 'express'
import { currentUser, refreshSession, signIn, signOut, signUp } from './auth.controller'
import { signInRateLimiter, signUpRateLimiter } from '../../middleware/rate-limit.middleware'
import { withControllerLogging } from '../../middleware/execution-logger.middleware'
import { authenticate } from '../../middleware/auth.middleware'

const authRouter = Router()

authRouter.post('/signup', signUpRateLimiter, withControllerLogging('auth', 'signUp', signUp))
authRouter.post('/signin', signInRateLimiter, withControllerLogging('auth', 'signIn', signIn))
authRouter.post('/refresh', withControllerLogging('auth', 'refresh', refreshSession))
authRouter.post('/signout', withControllerLogging('auth', 'signOut', signOut))
authRouter.get('/me', authenticate, withControllerLogging('auth', 'currentUser', currentUser))

export { authRouter }