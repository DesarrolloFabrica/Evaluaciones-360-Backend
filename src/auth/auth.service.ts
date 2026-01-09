import { ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { OAuth2Client } from "google-auth-library";

import { UserEntity, UserRole } from "../users/entities/user.entity";

@Injectable()
export class AuthService {
  private googleClient: OAuth2Client;

  constructor(
    private readonly config: ConfigService,
    private readonly jwt: JwtService,
    @InjectRepository(UserEntity)
    private readonly usersRepo: Repository<UserEntity>,
  ) {
    const clientId = this.config.get<string>("GOOGLE_CLIENT_ID") ?? "";
    this.googleClient = new OAuth2Client(clientId);
  }

  async loginWithGoogle(idToken: string) {
    const clientId = this.config.get<string>("GOOGLE_CLIENT_ID") ?? "";
    if (!clientId) {
      throw new UnauthorizedException("GOOGLE_CLIENT_ID no está configurado.");
    }

    const ticket = await this.googleClient.verifyIdToken({
      idToken,
      audience: clientId,
    });

    const payload = ticket.getPayload();
    if (!payload) throw new UnauthorizedException("Token de Google inválido.");

    const email = (payload.email ?? "").toLowerCase();
    const googleSub = payload.sub;

    if (!email) throw new UnauthorizedException("Token sin email.");
    if (!googleSub) throw new UnauthorizedException("Token sin sub.");
    if (payload.email_verified === false) {
      throw new UnauthorizedException("Email de Google no verificado.");
    }

    const user = await this.usersRepo.findOne({ where: { email } });
    if (!user) throw new ForbiddenException("Usuario no registrado.");
    if (!user.isActive) throw new ForbiddenException("Usuario inactivo.");

    // bind googleSub la primera vez; si ya existe, debe coincidir
    if (!user.googleSub) {
      user.googleSub = googleSub;
      await this.usersRepo.save(user);
    } else if (user.googleSub !== googleSub) {
      throw new ForbiddenException("Cuenta Google no coincide con el usuario registrado.");
    }

    const jwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role as UserRole,
      areaId: user.areaId ?? null,
      programId: user.programId ?? null,
    };

    const accessToken = await this.jwt.signAsync(jwtPayload);

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        areaId: user.areaId,
        programId: user.programId,
        isActive: user.isActive,
      },
    };
  }
}
