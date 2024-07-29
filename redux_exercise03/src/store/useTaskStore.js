import create from 'zustand';
import { persist } from 'zustand/middleware';

const useTaskStore = create(persist(
    (set, get) => ({
        tasks: [],
        users: ['user1', 'user2'],
        tags: [],
        selectedTag: 'ALL', // 선택된 태그 상태
        filter: 'ALL',
        currentUser: 'user1',
        isLoading: false,
        error: null,

        fetchTasks: async () => {
        set({ isLoading: true, error: null });
        try {
            const tasks = [
            { id: 1, title: 'Task 1', completed: false, tags: ['work'], user: 'user1' },
            { id: 2, title: 'Task 2', completed: true, tags: ['home'], user: 'user2' },
            { id: 3, title: 'Task 3', completed: false, tags: ['work', 'urgent'], user: 'user1' }
            ];
            set({ tasks });

            // 태그 목록을 업데이트합니다.
            const tags = [...new Set(tasks.flatMap(task => task.tags))];
            set({ tags });
        } catch (error) {
            set({ error: 'Failed to fetch tasks' });
        } finally {
            set({ isLoading: false });
        }
        },

        addTask: (title, tags = []) => {
        const newTask = { id: Date.now(), title, completed: false, tags, user: get().currentUser };
        set(state => ({ tasks: [...state.tasks, newTask] }));
        },

        deleteTask: (id) => {
        set(state => ({ tasks: state.tasks.filter(task => task.id !== id) }));
        },

        toggleTask: (id) => {
        set(state => ({
            tasks: state.tasks.map(task =>
            task.id === id ? { ...task, completed: !task.completed } : task
            )
        }));
        },

        setFilter: (filter) => set({ filter }),

        setUser: (user) => set({ currentUser: user }),

        setTags: (tags) => set({ tags }), // 태그 목록 업데이트

        setSelectedTag: (tag) => set({ selectedTag: tag }),

        filteredTasks: () => {
        const { tasks, filter, currentUser, selectedTag } = get();
        let filtered = tasks;

        // 필터 적용
        if (filter === 'COMPLETED') filtered = filtered.filter(task => task.completed);
        if (filter === 'INCOMPLETE') filtered = filtered.filter(task => !task.completed);

        // 사용자 기반 필터링
        if (currentUser) filtered = filtered.filter(task => task.user === currentUser);

        // 태그 기반 필터링
        if (selectedTag !== 'ALL') filtered = filtered.filter(task => task.tags.includes(selectedTag));

        return filtered;
        }
    }),
    {
        name: 'task-store',
    }
));

export default useTaskStore;
