// src/store/useTodoStore.js

import create from 'zustand';
import axios from 'axios'; // axios를 임포트합니다.

// Zustand 상태를 생성합니다.
const useTodoStore = create((set) => ({
    // todos 배열의 초기 상태입니다.
    todos: [],
    
    // 비동기 작업을 수행하여 todos 상태를 업데이트합니다.
    fetchTodos: async () => {
        try {
        // axios를 사용하여 데이터를 가져옵니다.
        const response = await axios.get('https://jsonplaceholder.typicode.com/todos?_limit=5');
        set({ todos: response.data });
        } catch (error) {
        console.error('Failed to fetch todos:', error);
        }
    },
    
    // 새로운 todo를 추가하는 함수입니다.
    addTodo: (title) => set((state) => ({
        todos: [...state.todos, { id: state.todos.length + 1, title, completed: false }]
    })),
    
    // 특정 todo를 삭제하는 함수입니다.
    deleteTodo: (id) => set((state) => ({
        todos: state.todos.filter(todo => todo.id !== id)
    })),
    
    // 특정 todo의 완료 상태를 토글하는 함수입니다.
    toggleTodo: (id) => set((state) => ({
        todos: state.todos.map(todo => 
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
        )
    })),
}));

export default useTodoStore;
