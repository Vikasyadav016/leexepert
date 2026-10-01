import { Router } from 'express'
import { signIn, signUp } from './auth.controller'
import { signInRateLimiter, signUpRateLimiter } from '../../middleware/rate-limit.middleware'

const authRouter = Router()

authRouter.post('/signup', signUpRateLimiter, signUp)
authRouter.post('/signin', signInRateLimiter, signIn)

export { authRouter }