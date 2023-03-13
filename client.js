 
const ws = new WebSocket('ws://94.250.251.110:3555/');

// Обрабатываем открытие соединения
ws.onopen = function() {
  console.log('WebSocket connection opened');
};

// Обрабатываем получение сообщений от сервера
ws.onmessage = function(event) {
  // Парсим сообщение как JSON объект
let data = JSON.parse(event.data);
  // В зависимости от типа сообщения выводим разный текст
switch (data.type) {
    case 'welcome':
      // Показываем свой идентификатор на странице

document.getElementById('output').innerHTML += `<p>Your ID is ${data.id}</p>`;
      break;
    case 'broadcast':
      // Показываем сообщение от другого клиента на странице
      document.getElementById('output').innerHTML += `<p>Broadcast from ${data.id}: ${data.message}</p>`;
      break;
    case 'private':
      // Показываем личное сообщение от другого клиента на странице
      document.getElementById('output').innerHTML += `<p>Private from ${data.id}: ${data.message}</p>`;
      break;
    default:
      // Игнорируем неизвестный тип сообщения
      break;
  }
};

 
const input = document.getElementById('input');
const send = document.getElementById('send');
const target = document.getElementById('target');

// Обрабатываем нажатие кнопки отправки сообщения
send.onclick = function() {
  // Получаем текст сообщения из поля ввода
let message = input.value;
  // Очищаем поле ввода
input.value = '';
  // Получаем выбранный целевой идентификатор из списка выбора или 'all' для рассылки всем клиентам

let targetId = target.value;

if (targetId === 'all') {

 

ws.send(JSON.stringify({ type: 'broadcast', message: message }));
} else {
    // Отправляем сообщение типа 'private' с текстом сообщения и целевым идентификатором на сервер

ws.send(JSON.stringify({ type: 'private', message: message, target: targetId }));
}}