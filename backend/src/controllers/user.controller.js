import { UserRepository } from "../repositories/user.repository.js";

const userRepository = new UserRepository();

export async function getAllCustomers(_, res) {
  try {
    const users = await userRepository.findAll();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
}
