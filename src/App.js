import React from 'react';
import TodoList from './components/TodoList.jsx'
import TodoForm from './components/TodoForm.jsx'

function App() {
  return (
    <div className="App">
      <TodoForm />
      <TodoList />
    </div>
  );
}

export default App;
