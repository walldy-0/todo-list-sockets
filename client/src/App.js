import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';

const App = () => {
  const [socket, setSocket] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [newTaskName, setNewTaskName] = useState('');

  useEffect(() => {
    const socket = io('ws://localhost:8000', { transports: ["websocket"] });

    socket.on('updateData', tasks => {
      setTasks(tasks);
    });

    socket.on('addTask', newTask => {
      addLocalTask(newTask);
    });

    socket.on('removeTask', taskIdToRemove => {
      removeLocalTask(taskIdToRemove);
    });

    setSocket(socket);
  }, []);

  const removeLocalTask = taskIdToRemove => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskIdToRemove));
  };

  const removeTask = taskIdToRemove => {
    removeLocalTask(taskIdToRemove);
    socket.emit('removeTask', taskIdToRemove);
  };

  const addLocalTask = newTask => {
    setTasks(prevTasks => [...prevTasks, newTask]);
  };

  const addTask = () => {
    const newTask = { id: uuidv4(), name: newTaskName };
    addLocalTask(newTask);
    socket.emit('addTask', newTask);
  };

  const addTaskSubmit = e => {
    e.preventDefault();

    if (newTaskName) {
      addTask();
      setNewTaskName('');
    } else {
      alert('Type task name.');
    }
  };

  return (
    <div className="App">
  
      <header>
        <h1>ToDoList.app</h1>
      </header>
  
      <section className="tasks-section" id="tasks-section">
        <h2>Tasks</h2>
  
        <ul className="tasks-section__list" id="tasks-list">
          {
            tasks.map(({id, name}) => { return(
              <li key={id} className="task">
                {name} <button className="btn btn--red" onClick={() => removeTask(id)}>Remove</button>
              </li>
            )})
          }
        </ul>
  
        <form id="add-task-form" onSubmit={e => addTaskSubmit(e)}>
          <input onChange={e => setNewTaskName(e.target.value.trim())} value={newTaskName} className="text-input" autoComplete="off" type="text" placeholder="Type your description" id="task-name" />
          <button className="btn" type="submit">Add</button>
        </form>
  
      </section>
    </div>
  );
};

export default App;
