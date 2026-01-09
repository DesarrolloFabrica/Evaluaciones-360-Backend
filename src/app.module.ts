import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AreasModule } from "./areas/areas.module";
import { ProgramsModule } from "./programs/programs.module";
import { LinesModule } from "./lines/lines.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const sslEnabled = (config.get<string>("DB_SSL") ?? "false") === "true";

        return {
          type: "postgres",
          host: config.get<string>("DB_HOST"),
          port: Number(config.get<string>("DB_PORT")),
          username: config.get<string>("DB_USER"),
          password: config.get<string>("DB_PASSWORD"),
          database: config.get<string>("DB_NAME"),

          autoLoadEntities: true,

          // synchronize: true para pruebas
          synchronize: true,
          // synchronize: false para entorno oficial
          // synchronize: false,
          
          logging: config.get<string>("TYPEORM_LOGGING") === "true",

          ssl: sslEnabled ? { rejectUnauthorized: false } : false,
          extra: sslEnabled ? { ssl: { rejectUnauthorized: false } } : undefined,

          migrations: ["dist/migrations/*.js"],
        };
      },
    }),

    // ✅ modules
    AreasModule,
    ProgramsModule,
    LinesModule,
  ],
})
export class AppModule {}
