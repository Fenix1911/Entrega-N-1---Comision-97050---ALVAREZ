import User from "../models/User.js";

class UserDAO {

  async getByEmail(email) {
    return await User.findOne({ email });
  }

  async create(data) {
    return await User.create(data);
  }

  async getById(id) {
    return await User.findById(id);
  }

  async update(id, data) {
    return User.findByIdAndUpdate(id, data, { new: true });
  }

}

export default UserDAO;