// src/components/TodoItem.jsx

import React from 'react';
import useTodoStore from '../store/useTodoStore';

function TodoItem({ todo }) {
    // useTodoStore 훅을 사용하여 상태 업데이트 함수를 가져옵니다.
    const { deleteTodo, toggleTodo } = useTodoStore();
    
    return (
        <div>
        <input 
            type="checkbox" 
            checked={todo.completed} 
            onChange={() => toggleTodo(todo.id)} 
        />
        <span style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
            {todo.title}
        </span>
        <button onClick={() => deleteTodo(todo.id)}>Delete</button>
        </div>
    );
}

export default TodoItem;
