import React, { useState, useEffect } from 'react';
import useTaskStore from '../store/useTaskStore';
import { Form, Button, InputGroup } from 'react-bootstrap';

function TaskForm() {
    const [title, setTitle] = useState('');
    const [tagsInput, setTagsInput] = useState('');
    const addTask = useTaskStore((state) => state.addTask);
    const setTags = useTaskStore((state) => state.setTags);

    const updateTags = (newTags) => {
        setTags(newTags); // 태그 목록을 업데이트합니다.
    };

    useEffect(() => {
        // 태그 목록을 업데이트합니다.
        const uniqueTags = [...new Set(tagsInput.split(',').map(tag => tag.trim()))];
        updateTags(uniqueTags);
    }, [tagsInput, setTags]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (title.trim()) {
        const tags = tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag);
        await addTask(title, tags);
        setTitle('');
        setTagsInput('');
        }
    };

    return (
        <Form onSubmit={handleSubmit} className="mb-3">
        <InputGroup>
            <Form.Control
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Add a new task"
            />
            <Form.Control
            type="text"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            placeholder="Add tags (comma separated)"
            />
            <Button type="submit" variant="primary">Add</Button>
        </InputGroup>
        </Form>
    );
}

export default TaskForm;
