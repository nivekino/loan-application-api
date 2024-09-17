// middlewares/authMiddleware.ts
import {
  Strategy as JwtStrategy,
  ExtractJwt,
  StrategyOptions,
} from "passport-jwt";
import passport from "passport";
import { Request, Response, NextFunction } from "express";
import { UserModel } from "../models/user.schema";

const JWT_SECRET = "xGH07sUaXD1";

const init = (): void => {
  const opts: StrategyOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("bearer"),
    secretOrKey: JWT_SECRET,
  };

  passport.use(
    new JwtStrategy(opts, async (jwtPayload, done) => {
      try {
        // Find the user associated with the token
        const user = await UserModel.findById(jwtPayload.userId);
        if (!user) {
          return done(null, false);
        }
        return done(null, user);
      } catch (error) {
        return done(error, false);
      }
    })
  );
};

const protectWithJwt = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  passport.authenticate("jwt", { session: false })(req, res, next);
};

export default { init, protectWithJwt };
