import passport from "../config/passport.js";

export const auth = passport.authenticate('jwt', { session: false });

export const isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Acceso denegado' });
    }
    next();
}


