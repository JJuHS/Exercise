// src/components/TodoList.jsx

import React, { useEffect } from 'react';
import useTodoStore from '../store/useTodoStore';
import TodoItem from './TodoItem';

function TodoList() {
    // useTodoStore 훅을 사용하여 상태와 함수를 가져옵니다.
    const { todos, fetchTodos } = useTodoStore();
    
    // 컴포넌트가 마운트될 때 todos를 가져옵니다.
    useEffect(() => {
        fetchTodos();
    }, [fetchTodos]);

    return (
        <div>
        {/* todos 배열을 순회하여 TodoItem 컴포넌트를 렌더링합니다. */}
        {todos.map(todo => (
            <TodoItem key={todo.id} todo={todo} />
        ))}
        </div>
    );
}

export default TodoList;
