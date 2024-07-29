import React from 'react';
import useTaskStore from '../store/useTaskStore';
import { ListGroup, Form, Button } from 'react-bootstrap';

function TaskItem({ task }) {
    const { deleteTask, toggleTask } = useTaskStore();

    return (
        <ListGroup.Item>
        <Form.Check
            type="checkbox"
            checked={task.completed}
            onChange={() => toggleTask(task.id)}
            label={
            <span style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
                {task.title} <small>({task.tags.join(', ')})</small>
            </span>
            }
        />
        <Button variant="danger" size="sm" onClick={() => deleteTask(task.id)} className="float-end">
            삭제
        </Button>
        </ListGroup.Item>
    );
}

export default TaskItem;
