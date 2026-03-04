import jwt from 'jsonwebtoken';
import { createHash, isValidPassword } from '../utils/crypt.js';
import dotenv from "dotenv";
import transporter from "../config/mailer.js";



dotenv.config();
export default class AuthService {
    constructor(userRepository, jwtSecret, cartRepository) {
        this.userRepository = userRepository;
        this.jwtSecret = jwtSecret;
        this.cartRepository = cartRepository;
    }

    async register(userData) {
        const { email, password } = userData;
        const exist = await this.userRepository.getUserByEmail(userData.email);
        if (exist) {
            throw new Error('El usuario ya existe');
        }

        const cart = await this.cartRepository.createCart();
        const user = await this.userRepository.createUser({
            ...userData,
            password: createHash(password),
            cart: cart._id
        });
        return user;
    }

    async login(email, password) {
        const user = await this.userRepository.getUserByEmail(email);
        if (!user) throw new Error('Usuario no encontrado');

        if (!isValidPassword(user, password)) {
            throw new Error('Contraseña incorrecta');
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        return{ user, token};
    }

    async forgotPassword(email) {
        const user = await this.userRepository.getUserByEmail(email);

        if (!user) {
            throw new Error("Usuario no encontrado");
        }

        const token = jwt.sign(
            { id: user._id },
            this.jwtSecret,
            { expiresIn: "1h" }
        );

        const resetLink = `http://localhost:8080/reset-password?token=${token}`;

        await transporter.sendMail({
            from: process.env.MAIL_USER,
            to: user.email,
            subject: "Recuperar contraseña",
            html: `
                <h2>Recuperar contraseña</h2>
                <p>Haz click en el botón para cambiar tu contraseña</p>
                <a href="${resetLink}">
                    <button>Restablecer contraseña</button>
                </a>
            `
        });

        return true;
    }


    async resetPassword(token, password) {

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await this.userRepository.getUserById(decoded.id);

        if (isValidPassword(user, password)) {
            throw new Error("No puedes usar la misma contraseña");
        }

        const hashed = createHash(password);

        await this.userRepository.updateUser(user._id, {
            password: hashed
        });

    }

}
