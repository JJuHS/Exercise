# REACT에서 Store관리하기

# Zustand 를 사용해서 Store 관리하기
## [1. Zustand란?](../redux_exercise)
## 2. Zustand 사용하기

<h3><strong>
(1) Zustand 기본사용법 
</strong></h3>

<h3><strong>(2) Zustand 활용하기 01</strong></h3>

<h3><strong>(3) Zustand 활용하기 02</strong></h3>

'고급' 작업관리 애플리케이션 만들기

파일도 많고, 함수도 많으니 컴포넌트에 대한 설명부터 하겠습니다.

<strong>기능 설명</strong>

<ul>
<li>작업 추가 : 새로운 작업 추가</li>

<li>작업 완료, 미완료 토글 : 완료 상태 토글</li>

<li>작업 삭제 : 작업 삭제</li>

<li>작업 필터링 : 완료 / 미완료 / 모든 으로 작업목록 필터링</li>

<li>로딩 및 오류 처리 : API 요청 중 로딩 및 오류 메시지 처리</li>
</ul>

<strong>컴포넌트 역할</strong>

<ul>
<li>TaskList 컴포넌트 : 작업목록표시, 컴포넌트 마운트시 서버에서 작업 가져오기, 로딩중일때 Loader컴포넌트 렌더링, 오류발생시 ErrorNotification컴포넌트 렌더링, 작업 필터링</li>
<li>TaskItem 컴포넌트 : 개별작업항목 렌더링, 작업완료상태표시, 체크박스를 통해 완료상태 토글, 작업삭제 기능</li>
<li>TaskForm 컴포넌트 : 새로운 작업 추가하는 폼 제공</li>
<li>Loader컴포넌트 : 로딩상태를 표시</li>
<li>FilterForm컴포넌트 : 작업 필터링 버튼 제공</li>
<li>ErrorNotification컴포넌트 : 오류메시지 표시</li>
</ul>

<strong>폴더 및 파일 구조</strong>

```css
src/
├── components/
│   ├── TaskList.jsx
│   ├── TaskItem.jsx
│   ├── TaskForm.jsx
│   ├── FilterForm.jsx
│   ├── Loader.jsx
│   └── ErrorNotification.jsx
├── store/
│   └── useTaskStore.js
├── App.jsx
└── index.js
```

컴포넌트별로 내부 코드를 살펴보겠습니다.

useTaskStore.js - 상태관리
```javascript
// src/store/useTaskStore.js
import create from 'zustand';
import axios from 'axios';

// Zustand 상태를 생성
const useTaskStore = create((set) => ({
  tasks: [], // 작업의 초기 상태
  filter: 'ALL', // 필터 상태
  isLoading: false, // 로딩 상태
  error: null, // 에러 상태

  // 비동기 작업을 수행하여 tasks 상태를 업데이트
  fetchTasks: async () => {
    set({ isLoading: true, error: null }); // 로딩 시작 및 에러 초기화
    try {
      const response = await axios.get('https://jsonplaceholder.typicode.com/todos?_limit=10');
      set({ tasks: response.data, isLoading: false });
    } catch (error) {
      set({ isLoading: false, error: 'Failed to fetch tasks' });
      console.error('Failed to fetch tasks:', error);
    }
  },

  // 새로운 task를 추가하는 함수
  addTask: async (title) => {
    try {
      const response = await axios.post('https://jsonplaceholder.typicode.com/todos', {
        title,
        completed: false
      });
      set((state) => ({
        tasks: [...state.tasks, response.data]
      }));
    } catch (error) {
      console.error('Failed to add task:', error);
    }
  },

  // 특정 task를 삭제하는 함수
  deleteTask: async (id) => {
    try {
      await axios.delete(`https://jsonplaceholder.typicode.com/todos/${id}`);
      set((state) => ({
        tasks: state.tasks.filter(task => task.id !== id)
      }));
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  },

  // 특정 task의 완료 상태를 토글하는 함수
  toggleTask: async (id) => {
    try {
      const task = useTaskStore.getState().tasks.find(task => task.id === id);
      const updatedTask = { ...task, completed: !task.completed };
      await axios.put(`https://jsonplaceholder.typicode.com/todos/${id}`, updatedTask);
      set((state) => ({
        tasks: state.tasks.map(task =>
          task.id === id ? updatedTask : task
        )
      }));
    } catch (error) {
      console.error('Failed to toggle task:', error);
    }
  },

  // 필터를 설정하는 함수
  setFilter: (filter) => set({ filter }),

  // 현재 필터에 따라 표시할 작업을 반환하는 선택자 함수
  filteredTasks: (state) => {
    switch (state.filter) {
      case 'COMPLETED':
        return state.tasks.filter(task => task.completed);
      case 'INCOMPLETE':
        return state.tasks.filter(task => !task.completed);
      default:
        return state.tasks;
    }
  }
}));

export default useTaskStore;
```

TaskList 컴포넌트
```javascript
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

  // 로딩 중일 때 Loader 컴포넌트를 렌더링
  if (isLoading) return <Loader />;

  // 에러가 발생했을 때 ErrorNotification 컴포넌트를 렌더링
  if (error) return <ErrorNotification message={error} />;

  return (
    <div>
      {/* filteredTasks를 사용하여 필터링된 작업을 렌더링 */}
      {filteredTasks().map(task => (
        <TaskItem key={task.id} task={task} />
      ))}
    </div>
  );
}

export default TaskList;
```

TaksItem 컴포넌트
```jsx
// src/components/TaskItem.jsx

import React from 'react';
import useTaskStore from '../store/useTaskStore';

function TaskItem({ task }) {
  // useTaskStore 훅을 사용하여 상태 업데이트 함수를 가져옵니다.
  const { deleteTask, toggleTask } = useTaskStore();
  
  return (
    <div>
      <input 
        type="checkbox" 
        checked={task.completed} 
        onChange={() => toggleTask(task.id)} 
      />
      <span style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
        {task.title}
      </span>
      <button onClick={() => deleteTask(task.id)}>Delete</button>
    </div>
  );
}

export default TaskItem;
```

TaskForm 컴포넌트

```jsx
// src/components/TaskForm.jsx
import React, { useState } from 'react';
import useTaskStore from '../store/useTaskStore';

function TaskForm() {
  // 입력값을 저장하는 로컬 상태를 생성
  const [title, setTitle] = useState('');
  // useTaskStore 훅을 사용하여 addTask 함수를 가져옵니다.
  const addTask = useTaskStore((state) => state.addTask);

  // 폼 제출 시 새로운 task를 추가하고 입력값을 초기화
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (title.trim()) {
      await addTask(title);
      setTitle('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="text" 
        value={title} 
        onChange={(e) => setTitle(e.target.value)} 
        placeholder="Add a new task" 
      />
      <button type="submit">Add</button>
    </form>
  );
}

export default TaskForm;
```

FilterForm 컴포넌트

```jsx
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
```

Loader 컴포넌트
```jsx
// src/components/Loader.jsx
import React from 'react';

function Loader() {
  return (
    <div>
      <p>Loading...</p>
    </div>
  );
}

export default Loader;
```

ErrorNotification 컴포넌트
```jsx
// src/components/ErrorNotification.jsx
import React from 'react';

function ErrorNotification({ message }) {
  return (
    <div style={{ color: 'red' }}>
      <p>{message}</p>
    </div>
  );
}

export default ErrorNotification;
```

App.js

```javascript
// src/App.jsx

import React from 'react';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import FilterForm from './components/FilterForm';

function App() {
  return (
    <div>
        <h1>Redux 연습하기</h1>
      <FilterForm />
      <TaskForm />
      <TaskList />
    </div>
  );
}

export default App;
```

index.js
```javascript
// src/index.js

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
```
