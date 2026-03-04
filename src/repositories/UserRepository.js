export default class UserRepository {

    constructor(dao) {
        this.dao = dao;
    }

    async getUserByEmail(email) {
        return await this.dao.findByEmail(email);
    }

    async getUserById(id) {
        return await this.dao.findById(id);
    }

    async createUser(userData) {
        return await this.dao.createUser(userData);
    }
}