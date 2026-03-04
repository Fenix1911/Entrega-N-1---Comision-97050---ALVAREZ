import jwt from 'jsonwebtoken';
import { createHash, isValidPassword } from '../utils/crypt.js';

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
            this.jwtSecret,
            { expiresIn: '1h' }
        );
        return{ user, token};
    }

}
