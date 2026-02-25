import passport from 'passport';
import { Strategy } from 'passport-jwt';
import { JWT_SECRET } from './jwt.js';
import User from '../models/User.js';

const cookiesExtractor = (req) => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies['jwtCookie'];
    }
    return token;
};

passport.use(new Strategy(
    {
        jwtFromRequest: cookiesExtractor,
        secretOrKey: JWT_SECRET,
    },
    async (payload, done) => {
        try {
            const user = await User.findById(payload.id).lean();
            if (!user) {
                return done(null, false);
            }
            return done(null, user);
        } catch (error) {
            return done(error, false);
        }
    }
));

export default passport;