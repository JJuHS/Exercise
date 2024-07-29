import React, { useEffect } from 'react';
import useTaskStore from '../store/useTaskStore';
import TaskItem from './TaskItem';
import Loader from './Loader';
import ErrorNotification from './ErrorNotification';
import { ListGroup } from 'react-bootstrap';

function TaskList() {
    const { fetchTasks, filteredTasks, isLoading, error } = useTaskStore();

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    if (isLoading) return <Loader />;
    if (error) return <ErrorNotification message={error} />;

    const tasksToRender = filteredTasks();

    return (
        <ListGroup>
        {tasksToRender.length > 0 ? (
            tasksToRender.map((task) => <TaskItem key={task.id} task={task} />)
        ) : (
            <ListGroup.Item>No tasks available.</ListGroup.Item>
        )}
        </ListGroup>
    );
}

export default TaskList;
