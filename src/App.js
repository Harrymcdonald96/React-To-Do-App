import React, { useState, useEffect } from 'react';
import TaskList from './components/TaskList';
import './styles/TaskApp.css';

function TaskApp() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [filter, setFilter] = useState('all'); // State to manage filter type

  useEffect(() => {
    fetch('/api/tasks')
      .then(response => response.json())
      .then(data => setTasks(data));
  }, []);

  const addTask = () => {
    if (newTask.trim()) {
      fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: newTask, completed: false }),
      })
        .then(response => response.json())
        .then(task => setTasks([...tasks, task]));
      setNewTask('');
    }
  };

  const deleteTask = (id) => {
    fetch(`/api/tasks/${id}`, { method: 'DELETE' })
      .then(() => setTasks(tasks.filter(task => task._id !== id)));
  };

  const toggleCompletion = (id) => {
    const task = tasks.find(task => task._id === id);
    fetch(`/api/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: !task.completed }),
    })
      .then(response => response.json())
      .then(updatedTask => {
        setTasks(tasks.map(task => task._id === id ? updatedTask : task));
      });
  };

  const updateTask = (id, newText) => {
    fetch(`/api/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: newText, completed: false }),
    })
      .then(response => response.json())
      .then(updatedTask => {
        setTasks(tasks.map(task => task._id === id ? updatedTask : task));
      });
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  return (
    <div id="app" className="app-container">
      <h1>To-Do List</h1>
      <input
        type="text"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        placeholder="Add a new task"
      />
      <button onClick={addTask}>Add Task</button>
      <TaskList tasks={filteredTasks} onDelete={deleteTask} onToggle={toggleCompletion} onUpdate={updateTask} />
      <div>
        <button onClick={() => setFilter('all')}>All</button>
        <button onClick={() => setFilter('active')}>Active</button>
        <button onClick={() => setFilter('completed')}>Completed</button>
      </div>
    </div>
  );
}

export default TaskApp;
