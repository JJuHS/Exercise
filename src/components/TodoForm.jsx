// src/components/TodoForm.jsx

import React, { useState } from 'react';
import useTodoStore from '../store/useTodoStore';

function TodoForm() {
    // 입력값을 저장하는 로컬 상태를 생성합니다.
    const [title, setTitle] = useState('');
    // useTodoStore 훅을 사용하여 addTodo 함수를 가져옵니다.
    const addTodo = useTodoStore((state) => state.addTodo);

    // 폼 제출 시 새로운 todo를 추가하고 입력값을 초기화합니다.
    const handleSubmit = (e) => {
        e.preventDefault();
        addTodo(title);
        setTitle('');
    };

    return (
        <form onSubmit={handleSubmit}>
        <input 
            type="text" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            placeholder="Add a new todo" 
        />
        <button type="submit">Add</button>
        </form>
    );
}

export default TodoForm;
