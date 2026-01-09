import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config";
import { UserRole } from "../users/entities/user.entity";

export type JwtPayload = {
  sub: string; // userId
  email: string;
  role: UserRole;
  areaId: string | null;
  programId: string | null;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get<string>("JWT_SECRET") ?? "change-me",
    });
  }

  async validate(payload: JwtPayload) {
    // lo que retornes aquí queda en req.user
    return {
      userId: payload.sub,
      email: payload.email,
      role: payload.role,
      areaId: payload.areaId ?? null,
      programId: payload.programId ?? null,
    };
  }
}
