// src/App.js

import React from 'react';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import FilterForm from './components/FilterForm';

function App() {
  return (
    <div>
      <h1>Advanced Task Management App with Zustand</h1>
      {/* FilterForm 컴포넌트를 렌더링합니다. */}
      <FilterForm />
      {/* TaskForm 컴포넌트를 렌더링합니다. */}
      <TaskForm />
      {/* TaskList 컴포넌트를 렌더링합니다. */}
      <TaskList />
    </div>
  );
}

export default App;
