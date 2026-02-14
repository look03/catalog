const { DataSource } = require('typeorm');
const path = require('path');
const envPath = path.resolve(__dirname, '../../../../.env');
require('dotenv').config({ path: envPath });

const dataSource = new DataSource({
  type: 'postgres',
  host: '127.0.0.1',
  port: Number(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  autoLoadEntities: true,
  synchronize: false,
  entities: [path.resolve(process.cwd(), 'src/**/*.entity.{ts,js}')],
  migrations: [path.resolve(process.cwd(), 'migrations/*.{ts,js}')],
});

module.exports = dataSource;