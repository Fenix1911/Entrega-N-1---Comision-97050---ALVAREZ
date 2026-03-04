import { Router } from "express";
import passport from "passport";

import UserDAO from "../dao/UserDAO.js";
import UserRepository from "../repositories/UserRepository.js";

import CartDAO from "../dao/CartDAO.js";
import CartRepository from "../repositories/CartRepository.js";

import AuthService from "../services/auth.service.js";

import { authorize } from "../middlewares/authorization.middleware.js";
import UserCurrentDTO from "../dto/UserCurrentDTO.js";


const router = Router();

const userRepository = new UserRepository(new UserDAO());
const cartRepository = new CartRepository(new CartDAO());
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

    res.clearCookie("coderToken");

    res.json({
        message: "Logout exitoso"
    });

});

router.post("/forgot-password", async (req, res) => {

  try {

    await authService.forgotPassword(req.body.email);

    res.json({
      message: "Email enviado"
    });

  } catch (error) {

    res.status(400).json({
      error: error.message
    });

  }

});

router.post("/reset-password", async (req, res) => {

    try {

        await authService.resetPassword(
            req.body.token,
            req.body.password
        );

        res.json({ message: "Contraseña actualizada" });

    } catch (error) {

        res.status(400).json({ error: error.message });

    }

});


export default router;