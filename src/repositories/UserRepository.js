export default class UserRepository {

    constructor(dao) {
        this.dao = dao;
    }

    async getUserByEmail(email) {
        return await this.dao.getByEmail(email);
    }

    async getUserById(id) {
        return await this.dao.getById(id);
    }

    async createUser(data) {
        return await this.dao.create(data);
    }

    async updateUser(id, data) {
        return await this.dao.update(id, data);
    }
}