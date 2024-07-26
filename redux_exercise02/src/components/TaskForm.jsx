// src/components/TaskForm.jsx

import React, { useState } from 'react';
import useTaskStore from '../store/useTaskStore';

function TaskForm() {
    // 입력값을 저장하는 로컬 상태를 생성합니다.
    const [title, setTitle] = useState('');
    // useTaskStore 훅을 사용하여 addTask 함수를 가져옵니다.
    const addTask = useTaskStore((state) => state.addTask);

    // 폼 제출 시 새로운 task를 추가하고 입력값을 초기화합니다.
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (title.trim()) {
        await addTask(title);
        setTitle('');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
        <input 
            type="text" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            placeholder="Add a new task" 
        />
        <button type="submit">Add</button>
        </form>
    );
}

export default TaskForm;
