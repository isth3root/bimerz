import { Strategy as LocalStrategy } from 'passport-local';
import authService from '../utils/authService.js';

export default (passport) => {
  // Local Strategy only - remove JWT strategy
  passport.use(new LocalStrategy(async (username, password, done) => {
    try {
      const user = await authService.validateCustomer(username, password);
      if (!user) {
        return done(null, false);
      }
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }));
};