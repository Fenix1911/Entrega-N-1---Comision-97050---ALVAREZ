import { Router } from "express";
import passport from "passport";

import UserDAO from "../dao/UserDAO.js";
import UserRepository from "../repositories/UserRepository";

import CartDAO from "../dao/CartDAO.js";
import CartRepository from "../repositories/CartRepository.js";

import AuthService from "../services/auth.service.js";

import { authorize } from "../middlewares/authorization.middleware.js";
import UserCurrentDTO from "../dto/UserCurrentDTO";

const router = Router();

const userRepository = new UserRepository(UserDAO);
const cartRepository = new CartRepository(CartDAO);
const authService = new AuthService(userRepository, process.env.JWT_SECRET, cartRepository);




router.post("/register", async (req, res) => {
  try {
    await authService.register(req.body);
    res.json({ status: "success" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const { token } = await authService.login(email, password);

    res.cookie("coderToken", token, {
      httpOnly: true,
      maxAge: 3600000
    });

    res.json({ status: "success" });

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get(
    "/current",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        const userDTO = new UserCurrentDTO(req.user);

        res.json({ user: userDTO });

    }
);

router.post("/logout", (req, res) => {

    res.clearCookie("jwtCookie");

    res.json({
        message: "Logout exitoso"
    });

});

export default router;