const express = require('express');
const socket = require('socket.io');

const tasks = [{ id: '1', name: 'Shopping' }, { id: '2', name: 'Go out with a dog' }];

const app = express();

const server = app.listen(8000, () => {
  console.log('Server is running on port: 8000');
});

const io = socket(server);

io.on('connection', (socket) => {
  console.log('New connection, id: ' + socket.id);

  io.to(socket.id).emit('updateData', tasks);

  socket.on('addTask', (task) => {
    tasks.push(task);
    socket.broadcast.emit('addTask', task);
  });

  socket.on('removeTask', (taskId) => {
    const indexToRemove = tasks.findIndex(task => task.id === taskId);
    if (indexToRemove > -1) {
      tasks.splice(indexToRemove, 1);
      socket.broadcast.emit('removeTask', taskId);
    }
  });
});

