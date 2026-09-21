//Фреймворк для создание сайтов
const mongoose = require('mongoose');

//Подключение разработчиков
const dotenv = require('dotenv');

//Обработка ошибок
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.stack);
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: './config.env' });

//Все значения храняться в app.js
const app = require('./app');

//Вход к БазеДанных
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

//Подключение к БазеДанных
mongoose.connect(DB).then(() => console.log('DB connected'));

//Создание сервера+порт
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
  console.log(`Mode: ${process.env.NODE_ENV}`);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM RECEIVED. Shutting down gracefully');
  server.close(() => {
    console.log('Process terminated!');
  });
});
