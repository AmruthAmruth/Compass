import express from 'express'
import { loadHomePage, loadLoginPage } from '../Controllers/AuthenticationController.js'

const Router=express.Router()

Router.get('/',loadHomePage)
Router.get('/login',loadLoginPage)

export default Router