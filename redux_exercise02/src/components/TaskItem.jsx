// src/components/TaskItem.jsx

import React from 'react';
import useTaskStore from '../store/useTaskStore';

function TaskItem({ task }) {
    // useTaskStore 훅을 사용하여 상태 업데이트 함수를 가져옵니다.
    const { deleteTask, toggleTask } = useTaskStore();
    
    return (
        <div>
        <input 
            type="checkbox" 
            checked={task.completed} 
            onChange={() => toggleTask(task.id)} 
        />
        <span style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
            {task.title}
        </span>
        <button onClick={() => deleteTask(task.id)}>Delete</button>
        </div>
    );
}

export default TaskItem;
