import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import path = require('path');
require('dotenv').config();

class ConfigService {

  constructor(private env: { [k: string]: string | undefined }) { }

  private getValue(key: string, throwOnMissing = true): string {
    const value = this.env[key];
    if (!value && throwOnMissing) {
      throw new Error(`config error - missing env.${key}`);
    }

    return value;
  }

  public ensureValues(keys: string[]) {
    keys.forEach(k => this.getValue(k, true));
    return this;
  }

  public getPort() {
    return this.getValue('PORT', true);
  }

  public isProduction() {
    const mode = this.getValue('MODE', false);
    return mode != 'DEV';
  }

  public getTypeOrmConfig(): TypeOrmModuleOptions {
    return {
      type: 'mysql',

      host: this.getValue('DB_HOSTNAME'),
      port: parseInt(this.getValue('DB_PORT')),
      username: this.getValue('DB_USERNAME'),
      password: this.getValue('DB_PASSWORD'),
      database: this.getValue('DB_DATABASENAME'),
      logging: true,
      autoLoadEntities: true,
      synchronize: true,
      // entities: ['src/entities/*.entity{.ts,.js}'],
      // migrations: ['src/migrations/*.ts'],

      entities: [path.join(__dirname, '../entities/*.entity{.ts,.js}')],
      migrations: [path.join(__dirname, '../migrations/*{.ts,.js}')],

      cli: {
        migrationsDir: 'src/migrations',
      },
      ssl: this.isProduction(),
    };
  }

}

const configService = new ConfigService(process.env)
  .ensureValues([
    'DB_HOSTNAME',
    'DB_PORT',
    'DB_USERNAME',
    'DB_PASSWORD',
    'DB_DATABASENAME'
  ]);

export { configService };