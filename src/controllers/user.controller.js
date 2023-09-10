import { UserRepository } from '../daos/repositories/user.repository.js';
import { STATUS } from '../utils/constantes.js'
import CustomError from '../utils/customErrors/customError.js';
import { generateUserError } from '../utils/customErrors/info.js'
import Error from '../utils/customErrors/enum.js';

const userRepository = new UserRepository()

class userController {


    async getAllUsers(req, res) {
        try {
            const users = await userRepository.getAllUsers();
            res.status(200).json({ users, status: STATUS.SUCCESS });
        } catch (error) {
            res.status(500).json({ error: error.message, status: STATUS.FAIL });
        }
    }

    async createUser(req, res) {
        try {
            const data = req.body;
            if (!data.first_name || !data.last_name || !data.email || !data.age || !data.password) {
                CustomError.createError({
                    name: "Error al crear el usuario",
                    cause: generateUserError(data),
                    message: "Error al crear el usuario",
                    code: Error.INVALID_TYPE_ERROR
                })
            }
            const result = await userRepository.createUser(data);
            res.status(201).json({ user: result, status: STATUS.SUCCESS });
        } catch (error) {
            res.status(400).json({ error: error.message, code: error.code, cause: error.cause, status: STATUS.FAIL });
        }
    }

    async getUserById(req, res) {
        try {
            const userId = req.params.uid;
            const user = await userRepository.getUserById(userId);
            res.status(200).json({ user, status: STATUS.SUCCESS });
        } catch (error) {
            res.status(400).json({ error: error.message, status: STATUS.FAIL });
        }
    }

    async updateUser(req, res) {
        try {
            const userId = req.params.uid;
            const updatedUserData = req.body;
            const result = await userRepository.updateUser(userId, updatedUserData);
            res.status(200).json({ result, status: STATUS.SUCCESS });
        } catch (error) {
            res.status(400).json({ error: error.message, status: STATUS.FAIL });
        }
    }
    async getUserByEmail(req, res) {
        try {
            const emailUser = req.params.emailUser
            const result = await userRepository.getUserByEmail(emailUser)
            res.status(200).json({ result, status: STATUS.SUCCESS })
        } catch (error) {
            res.status(400).json({ error: error.message, status: STATUS.FAIL });
        }
    }

    async deleteUser(req, res) {
        const userId = req.params.uid;
        try {
            const result = await userRepository.deleteUser(userId);
            res.status(200).json({ result, status: STATUS.SUCCESS });
        } catch (error) {
            res.status(400).json({ error: error.message, status: STATUS.FAIL });
        }
    }
}

export default new userController()