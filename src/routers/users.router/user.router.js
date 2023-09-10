import { Router } from 'express'
import userController from '../../controllers/user.controller.js'

class userRouter {
    constructor() {
        this.inicioUser = Router();
        this.inicioUser.get('/', userController.getAllUsers)
        this.inicioUser.get('/:email', userController.getUserByEmail)
        this.inicioUser.post('/', userController.createUser)
        this.inicioUser.get('/:uid', userController.getUserById)
        this.inicioUser.put('/:uid', userController.updateUser)
        this.inicioUser.delete('/:uid', userController.deleteUser)
        //this.getRouter = this.getRouter.bind(this)
    }

    getRouter() {
        return this.inicioUser
    }
}

export default userRouter

