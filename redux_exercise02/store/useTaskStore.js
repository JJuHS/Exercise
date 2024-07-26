// src/store/useTaskStore.js

import create from 'zustand';
import axios from 'axios';

// Zustand 상태를 생성합니다.
const useTaskStore = create((set) => ({
    tasks: [], // 작업의 초기 상태입니다.
    filter: 'ALL', // 필터 상태입니다.
    isLoading: false, // 로딩 상태입니다.
    error: null, // 에러 상태입니다.

    // 비동기 작업을 수행하여 tasks 상태를 업데이트합니다.
    fetchTasks: async () => {
        set({ isLoading: true, error: null }); // 로딩 시작 및 에러 초기화
        try {
        const response = await axios.get('https://jsonplaceholder.typicode.com/todos?_limit=10');
        set({ tasks: response.data, isLoading: false });
        } catch (error) {
        set({ isLoading: false, error: 'Failed to fetch tasks' });
        console.error('Failed to fetch tasks:', error);
        }
    },

    // 새로운 task를 추가하는 함수입니다.
    addTask: async (title) => {
        try {
        const response = await axios.post('https://jsonplaceholder.typicode.com/todos', {
            title,
            completed: false
        });
        set((state) => ({
            tasks: [...state.tasks, response.data]
        }));
        } catch (error) {
        console.error('Failed to add task:', error);
        }
    },

    // 특정 task를 삭제하는 함수입니다.
    deleteTask: async (id) => {
        try {
        await axios.delete(`https://jsonplaceholder.typicode.com/todos/${id}`);
        set((state) => ({
            tasks: state.tasks.filter(task => task.id !== id)
        }));
        } catch (error) {
        console.error('Failed to delete task:', error);
        }
    },

    // 특정 task의 완료 상태를 토글하는 함수입니다.
    toggleTask: async (id) => {
        try {
        const task = useTaskStore.getState().tasks.find(task => task.id === id);
        const updatedTask = { ...task, completed: !task.completed };
        await axios.put(`https://jsonplaceholder.typicode.com/todos/${id}`, updatedTask);
        set((state) => ({
            tasks: state.tasks.map(task =>
            task.id === id ? updatedTask : task
            )
        }));
        } catch (error) {
        console.error('Failed to toggle task:', error);
        }
    },

    // 필터를 설정하는 함수입니다.
    setFilter: (filter) => set({ filter }),

    // 현재 필터에 따라 표시할 작업을 반환하는 선택자 함수입니다.
    filteredTasks: (state) => {
        switch (state.filter) {
        case 'COMPLETED':
            return state.tasks.filter(task => task.completed);
        case 'INCOMPLETE':
            return state.tasks.filter(task => !task.completed);
        default:
            return state.tasks;
        }
    }
}));

export default useTaskStore;
