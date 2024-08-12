import React from 'react';
import TaskItem from './TaskItem';

function TaskList({ tasks, onDelete, onToggle, onUpdate }) {
  // This component renders a list of TaskItem components,
  // passing down specific actions like onDelete and onToggle as props.
  return (
    <ul>
      {tasks.map(task => (
        // Each task is represented by a TaskItem component.
        // The 'key' prop is essential for React to manage the list efficiently.
        <TaskItem key={task._id} task={task} onDelete={onDelete} onToggle={onToggle} onUpdate={onUpdate} />
      ))}
    </ul>
  );
}

export default TaskList;
