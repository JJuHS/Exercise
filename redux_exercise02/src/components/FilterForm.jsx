// src/components/FilterForm.jsx

import React from 'react';
import useTaskStore from '../store/useTaskStore';

function FilterForm() {
    // useTaskStore 훅을 사용하여 setFilter 함수를 가져옵니다.
    const setFilter = useTaskStore((state) => state.setFilter);

    return (
        <div>
        <button onClick={() => setFilter('ALL')}>All</button>
        <button onClick={() => setFilter('COMPLETED')}>Completed</button>
        <button onClick={() => setFilter('INCOMPLETE')}>Incomplete</button>
        </div>
    );
}

export default FilterForm;
