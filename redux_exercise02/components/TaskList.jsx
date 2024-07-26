// src/components/TaskList.jsx

import React, { useEffect } from 'react';
import useTaskStore from '../store/useTaskStore';
import TaskItem from './TaskItem';
import Loader from './Loader';
import ErrorNotification from './ErrorNotification';

function TaskList() {
    // useTaskStore 훅을 사용하여 상태와 함수를 가져옵니다.
    const { fetchTasks, filteredTasks, isLoading, error } = useTaskStore();

    // 컴포넌트가 마운트될 때 tasks를 가져옵니다.
    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    // 로딩 중일 때 Loader 컴포넌트를 렌더링합니다.
    if (isLoading) return <Loader />;

    // 에러가 발생했을 때 ErrorNotification 컴포넌트를 렌더링합니다.
    if (error) return <ErrorNotification message={error} />;

    return (
        <div>
        {/* filteredTasks를 사용하여 필터링된 작업을 렌더링합니다. */}
        {filteredTasks().map(task => (
            <TaskItem key={task.id} task={task} />
        ))}
        </div>
    );
}

export default TaskList;
