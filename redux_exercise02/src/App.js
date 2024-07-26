// src/App.js

import React from 'react';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import FilterForm from './components/FilterForm';

function App() {
  return (
    <div>
      <h1>Advanced Task Management App with Zustand</h1>
      <FilterForm />
      <TaskForm />
      <TaskList />
    </div>
  );
}

export default App;
