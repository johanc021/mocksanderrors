import { Router } from "express";
import SessionsController from '../../controllers/session.controller.js';

class SessionsRouter {
    constructor() {
        this.router = Router();
        this.configureRoutes();
    }

    configureRoutes() {
        this.router.post("/register", SessionsController.register);
        this.router.post("/login", SessionsController.login);
        this.router.post("/resetPassword", SessionsController.resetPassword);
        this.router.post("/logout", SessionsController.logout);
        this.router.post("/current", SessionsController.current);
    }

    getRouter() {
        return this.router;
    }
}

export default SessionsRouter;
