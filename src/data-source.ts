import "reflect-metadata"
import { DataSource } from "typeorm"
import { RequestEntity} from "./entity/Request"
import { config } from "dotenv";
config();


export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: true,
    logging: false,
    entities: [RequestEntity],
    migrations: [],
    subscribers: [],
})
