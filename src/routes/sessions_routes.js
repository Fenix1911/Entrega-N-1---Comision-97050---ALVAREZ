import { Router } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { createHash, isValidPassword } from "../utils/crypt.js";
import { JWT_SECRET } from "../config/jwt.js";
import passport from "../config/passport.js";


const router = Router();

router.post('/register', async (req, res) => {
    const { first_name, last_name, email, age, password } = req.body;
    
    const userExists = await User.findOne({ email });
    if (userExists) {
        return res.status(400).json({ message: 'El usuario ya existe' });
    }

    const newCart = await Cart.create({ products: [] });

    const user = await User.create({
        first_name,
        last_name,
        email,
        age,
        password: createHash(password),
        cart: newCart._id
    });

    res.json({ message: 'Usuario registrado exitosamente' });
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user || !isValidPassword(user, password)) {
        return res.status(401).json({ error: "Credenciales inválidas" });
    }

    const token = jwt.sign(
        { id: user._id, role: user.role }, 
        JWT_SECRET, 
        { expiresIn: '1h' }
    );
    
    res.cookie('jwtCookie', token, { 
        httpOnly: true,
        maxAge: 3600000,
    });
    res.json({ message: 'Login exitoso' });
});

router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({ user: req.user });
  }
);

router.post('/logout', (req, res) => {
    res.clearCookie('jwtCookie');
    res.json({ message: 'Logout exitoso' });
}
);

export default router;
