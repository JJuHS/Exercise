- 기본활용법 코드는 없습니다.

# REACT에서 Store관리하기

# Zustand 를 사용해서 Store 관리하기

## 1. Zustand란??

Zustand는 React 애플리케이션에서 상태 관리를 위한 라이브러리 중 하나로, 단순성과 성능을 중시하며, React 컴포넌트에서 전역 상태를 쉽게 관리할 수 있도록 도와줍니다. React의 Context API와 함께 사용할 수 있으며, 다른 라이브러리보다 매우 가볍고 간단하다는 특징이 있습니다.


<strong>특징</strong>
<ul>

<li>
<strong>단순한 API</strong>

간단하고 직관적인 API를 가지고 있는 Zustand는 상태를 생성, 구독, 업데이트하는 방법이 매우 간단하여 다른 상태 관리 라이브러리에 비해 학습 곡선이 낮습니다.
</li>

<li>
<strong>성능 최적화</strong>

Zustand의 상태 변경은 최소한의 리렌더링을 통해 애플리케이션의 성능을 최적화합니다.
</li>

<li>
<strong>사용 편의성</strong>

Zustand는 React Hooks를 기반으로 설계되어 있어, React함수형 컴포넌트에서 자연스럽게 사용할 수 있습니다.
</li>

<li>
<strong>중첩된 상태 지원</strong>

Zustand는 중첩된 상태를 자연스럽게 관리할 수 있어, 복잡한 상태 구조를 가진 애플리케이션에서 유용합니다.
</li>

<li>
<strong>미들웨어 지원</strong>

Zustand는 로깅, 비동기작업, 상태 유지 등의 다양한 미들웨어를 지원합니다.
</li>

</ul>

## 2. Zustand 사용하기

터미널에서 다음 명령어를 통해 zustand를 설치합니다.

```bash

npm install zustand

yarn add zustand
```


<h3><strong>(1) Zustand 기본 사용법</strong></h3>

간단한 예제를 통해 입문을 해봅시다.

우선 src폴더 내부에 store.js를 만들어주고, store를 사용할 임시컴포넌트 Counter.jsx도 만들어줍니다.

store.js 를 작성해봅시다.

주석내용을 참고해주세요.

```javascript
// store.js
import create from 'zustand'; // create함수 임포트

// Zustand 상태 생성
const useStore = create((set) => ({
    // count 상태를 생성하고 초깃값을 0으로 설정
    count: 0,

    // count 상태를 증가시키는 함수 생성
    increase: () => set(state => ({
        count:state.count + 1
    })),

    // count 상태를 감소시키는 함수 생성
    decrease: () => set(state => ({
        count:state.count - 1
    })),
}))

// useStore를 기본값으로 내보내기
export default useStore;
```

store.js에서 count라는 변수를 생성하고 숫자를 증가, 감소 시키는 함수를 만들었습니다.

이제 화면을 통해 적용시켜봅니다.

우선 아까 만들어둔 Counter.jsx를 App.js에 렌더링합니다.

```javascript
import React from 'react';
import Counter from './Counter.jsx';

function App() {
  return (
    <div className="App">
      <Counter />
    </div>
  );
}

export default App;
```

이제 Counter.jsx를 작성해봅시다.

```jsx
// Counter.jsx
import React from 'react';
import useStore from './store';

function Counter() {
  // useStore 훅을 사용하여 count 상태와 increase, decrease 함수를 가져옵니다.
  const { count, increase, decrease } = useStore();
  
  return (
    <div>
      {/* 현재 count 상태를 화면에 표시합니다. */}
      <h1>{count}</h1>
      
      {/* increase 함수를 호출하여 count 상태를 증가시킵니다. */}
      <button onClick={increase}>Increase</button>
      
      {/* decrease 함수를 호출하여 count 상태를 감소시킵니다. */}
      <button onClick={decrease}>Decrease</button>
    </div>
  );
}

export default Counter;
```

<h3><strong>(2) Zustand 활용하기</strong></h3>

Zustand를 활용해서 간단한 Todo App을 만들어보겠습니다.

비동기작업을 위해 Axios라이브러리를 받아줍니다.

```bash
npm i axios
yarn add axios
```

우선 다음과 같은 폴더구조를 만들어줍니다.

```
src/
├── node_modules
├── public
├── components/
│   ├── TodoList.jsx
│   ├── TodoItem.jsx
│   └── TodoForm.jsx
├── store/
│   └── useTodoStore.js
├── App.jsx
└── index.js
```

App.jsx에 todo리스트를 입력받는 폼 컴포넌트와 todo리스트 목록을 출력하게 해주는 컴포넌트를 렌더링합니다.

```javascript
// App.js
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
```

상태관리 Store부터 만들어봅시다.
[jsonplaceholder페이지](https://jsonplaceholder.typicode.com/todos) 에서 초기 할일 목록을 가져오겠습니다.

```javascript
// src/store/useTodoStore.js
import create from 'zustand';
import axios from 'axios';

// Zustand 상태를 생성
const useTodoStore = create((set) => ({
    // todos 배열의 초기 상태
    todos: [],
    
    // 비동기 작업을 수행하여 todos 상태를 업데이트
    fetchTodos: async () => {
    try {
      const response = await axios.get('https://jsonplaceholder.typicode.com/todos?_limit=5');
      set({ todos: response.data });
    } catch (error) {
      console.error('Failed to fetch todos:', error);
    }
  },
    
    // 새로운 todo를 추가하는 함수
    addTodo: (title) => set((state) => ({
        todos: [...state.todos, { id: state.todos.length + 1, title, completed: false }]
    })),
    
    // 특정 todo를 삭제하는 함수
    deleteTodo: (id) => set((state) => ({
        todos: state.todos.filter(todo => todo.id !== id)
    })),
    
    // 특정 todo의 완료 상태를 토글하는 함수
    toggleTodo: (id) => set((state) => ({
        todos: state.todos.map(todo => 
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
        )
    })),
}));

export default useTodoStore;
```

함수와 상태를 모두 만들었으니, 각 컴포넌트 별로 사용해주겠습니다.

TodoItem 컴포넌트
```jsx
// src/components/TodoItem.jsx

import React from 'react';
import useTodoStore from '../store/useTodoStore';

function TodoItem({ todo }) {
    // useTodoStore 훅을 사용하여 상태 업데이트 함수를 가져옵니다.
    const { deleteTodo, toggleTodo } = useTodoStore();
    
    return (
      <div>
        <input 
          type="checkbox" 
          checked={todo.completed} 
          onChange={() => toggleTodo(todo.id)} 
        />
        <span style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
          {todo.title}
        </span>
        <button onClick={() => deleteTodo(todo.id)}>Delete</button>
      </div>
    );
}

export default TodoItem;
```

TodoList 컴포넌트

```jsx
// src/components/TodoList.jsx

import React, { useEffect } from 'react';
import useTodoStore from '../store/useTodoStore';
import TodoItem from './TodoItem';

function TodoList() {
  // useTodoStore 훅을 사용하여 상태와 함수를 가져옵니다.
  const { todos, fetchTodos } = useTodoStore();
  
  // 컴포넌트가 마운트될 때 todos를 가져옵니다.
  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  return (
    <div>
      {/* todos 배열을 순회하여 TodoItem 컴포넌트를 렌더링합니다. */}
      {todos.map(todo => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </div>
  );
}

export default TodoList;

```

TodoForm 컴포넌트
```jsx
// src/components/TodoForm.jsx

import React, { useState } from 'react';
import useTodoStore from '../store/useTodoStore';

function TodoForm() {
  // 입력값을 저장하는 로컬 상태를 생성
  const [title, setTitle] = useState('');
  // useTodoStore 훅을 사용하여 addTodo 함수를 가져옵니다.
  const addTodo = useTodoStore((state) => state.addTodo);

  // 폼 제출 시 새로운 todo를 추가하고 입력값을 초기화
  const handleSubmit = (e) => {
    e.preventDefault();
    addTodo(title);
    setTitle('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="text" 
        value={title} 
        onChange={(e) => setTitle(e.target.value)} 
        placeholder="Add a new todo" 
      />
      <button type="submit">Add</button>
    </form>
  );
}

export default TodoForm;
```
