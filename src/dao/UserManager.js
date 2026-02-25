import User from "../models/User.js";

class UserManager {

  async findByEmail(email) {
    return await User.findOne({ email });
  }

  async createUser(data) {
    return await User.create(data);
  }

  async findById(id) {
    return await User.findById(id);
  }

}

export default new UserManager();