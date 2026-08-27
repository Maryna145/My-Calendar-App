import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import eventRoutes from './routes/eventRoutes.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if(!process.env.CONNECTION_STRING){
  console.warn("Попередження: CONNECTION_STRING відсутній у файлі .env");
} else {
  mongoose.connect(process.env.CONNECTION_STRING)
      .then(() => console.log('Успішно підключено до MongoDB'))
      .catch((error) => console.log('Помилка підключення до БД:', error));
}

// Тестовий роут
app.get('/', (req, res) => {
  res.send('Сервер календаря працює!');
});

app.use("/api/events", eventRoutes);

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});