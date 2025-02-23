import { AppDataSource } from "./data-source"
import express from "express";
import { config } from "dotenv";
import router from "./routes/requestRoutes";
config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

AppDataSource.initialize().then(async () => {
    console.log('Успешное подключение к базе данных');
    app.listen(PORT, () => {
        console.log(`Сервер запущен на http://localhost:${PORT}`);
    });
}).catch(error => console.log(error))

app.use("/api", router)