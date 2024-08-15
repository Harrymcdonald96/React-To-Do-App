import React, { useState } from 'react';
import '../styles/TaskItem.css';


function TaskItem({ task, onDelete, onToggle, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);  // State to manage editing mode
  const [editedText, setEditedText] = useState(task.text);  // State to hold edited text

  // Function to handle editing of a task
  const handleEdit = () => {
    if (editedText.trim()) {  // Prevent saving empty tasks
      onUpdate(task._id, editedText);  // Call the onUpdate function passed as a prop
      setIsEditing(false);  // Exit editing mode after updating
    }
  };

  // Function to handle the edit mode initiation
  const startEdit = () => {
    setIsEditing(true);
  };

  return (
    <div className={`task-item ${task.completed ? 'completed' : ''}`}>
      {isEditing ? (
        <input
          type="text"
          value={editedText}
          className="task-input"
          onChange={(e) => setEditedText(e.target.value)}
          onBlur={handleEdit}  // Handle edit finalization on blur
          onKeyPress={(e) => e.key === 'Enter' && handleEdit()}  // Finalize edit on Enter key
        />
      ) : (
        <span className="task-text" onDoubleClick={startEdit}>{task.text}</span>  // Double click to edit
      )}
      <div className="task-actions">
        <button onClick={() => onDelete(task._id)} title="Delete Task">
          <i className="fas fa-trash"></i>
        </button>
        <button onClick={() => onToggle(task._id)} title="Toggle Completion">
          <i className={`fas ${task.completed ? 'fa-undo-alt' : 'fa-check'}`}></i>
        </button>
        <button onClick={startEdit} title="Edit Task">
          <i className="fas fa-edit"></i>
        </button>
      </div>
    </div>
  );
}

export default TaskItem;
