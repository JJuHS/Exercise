import React from 'react';
import useTaskStore from '../store/useTaskStore';
import { ButtonGroup, Button } from 'react-bootstrap';

function FilterForm() {
    const setFilter = useTaskStore((state) => state.setFilter);

    return (
        <ButtonGroup className="mb-3">
        <Button variant="secondary" onClick={() => setFilter('ALL')}>전체</Button>
        <Button variant="secondary" onClick={() => setFilter('COMPLETED')}>완료</Button>
        <Button variant="secondary" onClick={() => setFilter('INCOMPLETE')}>미완료</Button>
        </ButtonGroup>
    );
}

export default FilterForm;
