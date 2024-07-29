import React from 'react';
import useTaskStore from '../store/useTaskStore';
import { Form } from 'react-bootstrap';

function TagFilter() {
    const tags = useTaskStore((state) => state.tags);
    const selectedTag = useTaskStore((state) => state.selectedTag);
    const setSelectedTag = useTaskStore((state) => state.setSelectedTag);
    console.log(tags);
    return (
        <Form.Group className="mb-3">
        <Form.Label>Filter by Tag</Form.Label>
        <Form.Control
            as="select"
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
        >
            <option value="ALL">All</option>
            {tags.map(tag => (
            <option key={tag} value={tag}>{tag}</option>
            ))}
        </Form.Control>
        </Form.Group>
    );
}

export default TagFilter;
