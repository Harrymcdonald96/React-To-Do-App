import React, { useState, useEffect } from 'react';
import TaskList from './TaskList';
import '../styles/TaskApp.css';

function TaskApp() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetch('/api/tasks')
      .then(response => response.json())
      .then(data => setTasks(data))
      .catch(error => console.error('Failed to load tasks:', error));
  }, []);

  const addTask = (event) => {
    event.preventDefault();
    if (newTask.trim()) {
      fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: newTask, completed: false }),
      })
        .then(response => response.json())
        .then(task => {
          setTasks([...tasks, task]);
          setNewTask('');
        })
        .catch(error => console.error('Failed to add task:', error));
    }
  };

  const deleteTask = (id) => {
    fetch(`/api/tasks/${id}`, { method: 'DELETE' })
      .then(() => setTasks(tasks.filter(task => task._id !== id)))
      .catch(error => console.error('Failed to delete task:', error));
  };

  const toggleCompletion = (id) => {
    const task = tasks.find(task => task._id === id);
    if (task) {
      fetch(`/api/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !task.completed }),
      })
        .then(response => response.json())
        .then(updatedTask => {
          setTasks(tasks.map(task => task._id === id ? updatedTask : task));
        })
        .catch(error => console.error('Failed to toggle task completion:', error));
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  return (
    <div id="app">
      <h1>To-Do List</h1>
      <div className="task-form-container">
        <form onSubmit={addTask} className="task-form">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Add a new task"
            className="task-input"
          />
          <button type="submit">Add Task</button>
        </form>
      </div>
      <TaskList tasks={filteredTasks} onDelete={deleteTask} onToggle={toggleCompletion} />
      <div className="filter-buttons">
        <button onClick={() => setFilter('all')}>All</button>
        <button onClick={() => setFilter('active')}>Active</button>
        <button onClick={() => setFilter('completed')}>Completed</button>
      </div>
    </div>
  );
}

export default TaskApp;
