export const fetchTasksFromAPI = async () => {
        return [
        { id: 1, title: 'Task 1', completed: false, tags: ['work'], user: 'user1' },
        { id: 2, title: 'Task 2', completed: true, tags: ['home'], user: 'user2' }
        ];
    };
    
    export const addTaskToAPI = async (task) => {
        return task;
    };
    
    export const deleteTaskFromAPI = async (id) => {
        return id;
    };
    
    export const updateTaskInAPI = async (id, updatedTask) => {
        return updatedTask;
};
  