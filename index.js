

const express = require('express');
const http = require('http'); 
const WebSocket = require('ws'); 
const uuid = require('uuid'); 

// Создаем приложение express 
const app = express(); // Создаем сервер http 
const server = http.createServer(app);

const wss = new WebSocket.Server({ server });

// Обрабатываем подключение клиентов
wss.on('connection', function connection(ws) {
  // Генерируем уникальный идентификатор для клиента
  ws.id = uuid.v4();
  // Отправляем приветственное сообщение клиенту
  ws.send(JSON.stringify({ type: 'welcome', id: ws.id }));
  // Обрабатываем получение сообщений от клиента
  ws.on('message', function incoming(message) {
    // Парсим сообщение как JSON объект
let data = JSON.parse(message);
    // В зависимости от типа сообщения выполняем разные действия
    switch (data.type) {
      case 'broadcast':
        // Рассылаем сообщение всем подключенным клиентам
        wss.clients.forEach(function each(client) {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ type: 'broadcast', id: ws.id, message: data.message }));
          }
        });
        break;
      case 'private':
        // Отправляем сообщение конкретному клиенту по его идентификатору

let target = wss.clients.find(client => client.id === data.target);
        if (target && target.readyState === WebSocket.OPEN) {
          target.send(JSON.stringify({ type: 'private', id: ws.id, message: data.message }));
        }
        break;
      default:
        // Игнорируем неизвестный тип сообщения
        break;
    }
  });
});

// Запускаем сервер на порту 3000
server.listen(3555, function() {
  console.log('Server is listening on port 3555');
});