// src/store/useTodoStore.js
import create from 'zustand';

// Zustand 상태를 생성합니다.
const useTodoStore = create((set) => ({
    // todos 배열의 초기 상태
    todos: [],
    
    // 비동기 작업을 수행하여 todos 상태를 업데이트
    fetchTodos: async () => {
        const response = await fetch('https://jsonplaceholder.typicode.com/todos?_limit=10');
        const data = await response.json();
        set({ todos: data });
    },
    
    // 새로운 todo를 추가하는 함수
    addTodo: (title) => set((state) => ({
        todos: [...state.todos, { id: state.todos.length + 1, title, completed: false }]
    })),
    
    // 특정 todo를 삭제하는 함수
    deleteTodo: (id) => set((state) => ({
        todos: state.todos.filter(todo => todo.id !== id)
    })),
    
    // 특정 todo의 완료 상태를 토글하는 함수
    toggleTodo: (id) => set((state) => ({
        todos: state.todos.map(todo => 
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
        )
    })),
}));

export default useTodoStore;
