import User from "../models/User.js";

class UserDAO {

  async findByEmail(email) {
    return await User.findOne({ email });
  }

  async createUser(data) {
    return await User.create(data);
  }

  async findById(id) {
    return await User.findById(id);
  }

  async update(id, data) {
    return User.findByIdAndUpdate(id, data, { new: true });
  }

}

export default new UserDAO();