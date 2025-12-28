import { User } from "../models/user.model.js";

export class UserRepository {
  findAll() {
    return User.find().sort({ createdAt: -1 });
  }

  count() {
    return User.countDocuments();
  }
}
