# REACT에서 Store관리하기

# Zustand 를 사용해서 Store 관리하기
## [1. Zustand란?](../redux_exercise)
## [2. Zustand 사용하기](../redux_exercise02)

<h3><strong>
(1) Zustand 기본사용법 
</strong></h3>

<h3><strong>(2) Zustand 활용하기 01</strong></h3>

<h3><strong>(3) Zustand 활용하기 02</strong></h3>

<h3><strong>(4) Zustand 활용하기 03</strong></h3>

'고급' 작업관리 애플리케이션 만들기

태그 기능 추가, css작업 추가

<strong>기능 설명</strong>

<ul>
<li>작업 추가 : 새로운 작업 추가</li>

<li>작업 완료, 미완료 토글 : 완료 상태 토글</li>

<li>작업 삭제 : 작업 삭제</li>

<li>작업 필터링 : 완료 / 미완료 / 모든 으로 작업목록 필터링</li>

<li>태그 필터링 : 태그별로 작업 필터링</li>

<li>로딩 및 오류 처리 : API 요청 중 로딩 및 오류 메시지 처리</li>
</ul>

<strong>컴포넌트 역할</strong>

<ul>
<li>TaskList 컴포넌트 : 작업목록표시, 컴포넌트 마운트시 서버에서 작업 가져오기, 로딩중일때 Loader컴포넌트 렌더링, 오류발생시 ErrorNotification컴포넌트 렌더링, 작업 필터링</li>
<li>TaskItem 컴포넌트 : 개별작업항목 렌더링, 작업완료상태표시, 체크박스를 통해 완료상태 토글, 작업삭제 기능</li>
<li>TaskForm 컴포넌트 : 새로운 작업 추가하는 폼 제공</li>
<li>Loader컴포넌트 : 로딩상태를 표시</li>
<li>FilterForm컴포넌트 : 작업 필터링 버튼 제공, 태그선택필터 추가</li>
<li>ErrorNotification컴포넌트 : 오류메시지 표시</li>
</ul>

<strong>폴더 및 파일 구조</strong>

```css
📦src
 ┣ 📂components
 ┃ ┣ 📜ErrorNotification.jsx
 ┃ ┣ 📜FilterForm.jsx
 ┃ ┣ 📜Loader.jsx
 ┃ ┣ 📜TagFilter.jsx
 ┃ ┣ 📜TaskForm.jsx
 ┃ ┣ 📜TaskItem.jsx
 ┃ ┗ 📜TaskList.jsx
 ┣ 📂css
 ┃ ┗ 📜style.css
 ┣ 📂store
 ┃ ┗ 📜useTaskStore.js
 ┣ 📜App.js
 ┗ 📜index.js
```

컴포넌트별로 내부 코드를 살펴보겠습니다.

useTaskStore.js

```javascript
// Zustand를 사용하여 상태 관리를 위한 스토어를 생성합니다.
// `persist` 미들웨어는 상태를 로컬 스토리지에 저장하여 페이지 새로고침 후에도 상태를 유지합니다.
import create from 'zustand';
import { persist } from 'zustand/middleware';

// Zustand 스토어를 생성합니다.
// `persist` 미들웨어를 사용하여 상태를 브라우저의 로컬 스토리지에 저장합니다.
const useTaskStore = create(persist(
    (set, get) => ({
        // 상태의 초기 값
        tasks: [], // 작업 목록을 저장합니다.
        users: ['user1', 'user2'], // 사용할 수 있는 사용자 목록
        tags: [], // 태그 목록을 저장합니다.
        selectedTag: 'ALL', // 현재 선택된 태그 (필터링 기준으로 사용됨)
        filter: 'ALL', // 작업 목록을 필터링하는 기준 (ALL, COMPLETED, INCOMPLETE)
        currentUser: 'user1', // 현재 로그인한 사용자
        isLoading: false, // 로딩 상태를 나타냅니다.
        error: null, // 에러 메시지를 저장합니다.

        // 작업 목록을 가져오는 비동기 함수
        fetchTasks: async () => {
            set({ isLoading: true, error: null }); // 로딩 시작 및 에러 초기화
            try {
                // 임의의 작업 데이터를 생성합니다.
                const tasks = [
                    { id: 1, title: 'Task 1', completed: false, tags: ['work'], user: 'user1' },
                    { id: 2, title: 'Task 2', completed: true, tags: ['home'], user: 'user2' },
                    { id: 3, title: 'Task 3', completed: false, tags: ['work', 'urgent'], user: 'user1' }
                ];
                set({ tasks }); // 상태에 작업 목록을 설정합니다.

                // 태그 목록을 업데이트합니다. 각 태그는 중복되지 않도록 처리합니다.
                const tags = [...new Set(tasks.flatMap(task => task.tags))];
                set({ tags }); // 상태에 태그 목록을 설정합니다.
            } catch (error) {
                // 작업 목록을 가져오는 데 실패했을 때 에러를 설정합니다.
                set({ error: 'Failed to fetch tasks' });
            } finally {
                // 로딩 상태를 false로 설정하여 로딩이 완료되었음을 표시합니다.
                set({ isLoading: false });
            }
        },

        // 새로운 작업을 추가하는 함수
        addTask: (title, tags = []) => {
            // 새 작업 객체를 생성합니다. `id`는 현재 시간으로 설정하여 유일한 값을 생성합니다.
            const newTask = { id: Date.now(), title, completed: false, tags, user: get().currentUser };
            // 상태의 작업 목록에 새 작업을 추가합니다.
            set(state => ({ tasks: [...state.tasks, newTask] }));
        },

        // 특정 작업을 삭제하는 함수
        deleteTask: (id) => {
            // 작업 목록에서 해당 `id`와 일치하지 않는 작업만 남깁니다.
            set(state => ({ tasks: state.tasks.filter(task => task.id !== id) }));
        },

        // 특정 작업의 완료 상태를 토글하는 함수
        toggleTask: (id) => {
            // 작업 목록에서 해당 `id`의 작업을 찾아 완료 상태를 반전시킵니다.
            set(state => ({
                tasks: state.tasks.map(task =>
                    task.id === id ? { ...task, completed: !task.completed } : task
                )
            }));
        },

        // 작업 필터를 설정하는 함수
        setFilter: (filter) => set({ filter }),

        // 현재 사용자를 설정하는 함수
        setUser: (user) => set({ currentUser: user }),

        // 태그 목록을 업데이트하는 함수
        setTags: (tags) => set({ tags }),

        // 선택된 태그를 설정하는 함수
        setSelectedTag: (tag) => set({ selectedTag: tag }),

        // 현재 필터와 태그에 따라 작업 목록을 필터링하여 반환하는 함수
        filteredTasks: () => {
            const { tasks, filter, currentUser, selectedTag } = get();
            let filtered = tasks;

            // 필터를 적용합니다.
            if (filter === 'COMPLETED') filtered = filtered.filter(task => task.completed);
            if (filter === 'INCOMPLETE') filtered = filtered.filter(task => !task.completed);

            // 사용자 기반 필터링을 적용합니다.
            if (currentUser) filtered = filtered.filter(task => task.user === currentUser);

            // 태그 기반 필터링을 적용합니다.
            if (selectedTag !== 'ALL') filtered = filtered.filter(task => task.tags.includes(selectedTag));

            return filtered; // 필터링된 작업 목록을 반환합니다.
        }
    }),
    {
        name: 'task-store', // 로컬 스토리지에 저장될 상태의 이름
    }
));

export default useTaskStore;

```

TaskForm.jsx 

```jsx
// React와 React Hook, 그리고 Zustand 상태 관리를 위한 useTaskStore를 임포트합니다.
// React-Bootstrap의 Form, Button, InputGroup 컴포넌트를 임포트하여 폼을 스타일링합니다.
import React, { useState, useEffect } from 'react';
import useTaskStore from '../store/useTaskStore';
import { Form, Button, InputGroup } from 'react-bootstrap';

// TaskForm 컴포넌트 정의
function TaskForm() {
    // 작업 제목과 태그 입력을 위한 상태를 정의합니다.
    const [title, setTitle] = useState(''); // 작업 제목을 저장하는 상태
    const [tagsInput, setTagsInput] = useState(''); // 태그 입력을 저장하는 상태

    // Zustand의 스토어에서 addTask와 setTags 함수를 가져옵니다.
    const addTask = useTaskStore((state) => state.addTask); // 작업 추가 함수
    const setTags = useTaskStore((state) => state.setTags); // 태그 목록 업데이트 함수

    // 태그 목록을 업데이트하는 함수
    const updateTags = (newTags) => {
        setTags(newTags); // 스토어에 새로운 태그 목록을 설정합니다.
    };

    // 태그 입력이 변경될 때마다 태그 목록을 업데이트합니다.
    useEffect(() => {
        // tagsInput 문자열을 쉼표로 분리하여 태그 배열을 생성합니다.
        // 중복된 태그를 제거하기 위해 Set을 사용하고, 각 태그의 앞뒤 공백을 제거합니다.
        const uniqueTags = [...new Set(tagsInput.split(',').map(tag => tag.trim()))];
        updateTags(uniqueTags); // 스토어에 업데이트된 태그 목록을 설정합니다.
    }, [tagsInput, setTags]); // tagsInput 또는 setTags가 변경될 때마다 실행됩니다.

    // 폼 제출 핸들러
    const handleSubmit = async (e) => {
        e.preventDefault(); // 기본 폼 제출 동작을 방지합니다.
        
        // 제목이 비어있지 않은 경우에만 작업을 추가합니다.
        if (title.trim()) {
            // tagsInput을 쉼표로 분리하고, 각 태그의 앞뒤 공백을 제거한 후, 빈 태그는 필터링합니다.
            const tags = tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag);
            // 상태에 새 작업을 추가합니다. addTask는 비동기 함수입니다.
            await addTask(title, tags);
            // 입력 필드를 초기화합니다.
            setTitle('');
            setTagsInput('');
        }
    };

    // 컴포넌트의 렌더링 부분
    return (
        <Form onSubmit={handleSubmit} className="mb-3">
            <InputGroup>
                {/* 작업 제목 입력 필드 */}
                <Form.Control
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Add a new task"
                />
                {/* 태그 입력 필드 */}
                <Form.Control
                    type="text"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="Add tags (comma separated)"
                />
                {/* 제출 버튼 */}
                <Button type="submit" variant="primary">Add</Button>
            </InputGroup>
        </Form>
    );
}

export default TaskForm;
```

TaskItem.jsx

```jsx
// React 라이브러리와 Zustand 상태 관리를 위한 useTaskStore를 임포트합니다.
// React-Bootstrap의 ListGroup, Form, Button 컴포넌트를 임포트하여 UI를 스타일링합니다.
import React from 'react';
import useTaskStore from '../store/useTaskStore';
import { ListGroup, Form, Button } from 'react-bootstrap';

// TaskItem 컴포넌트 정의
// props로 개별 작업을 받아옵니다.
function TaskItem({ task }) {
    // Zustand의 스토어에서 deleteTask와 toggleTask 함수를 가져옵니다.
    const { deleteTask, toggleTask } = useTaskStore();

    // 컴포넌트의 렌더링 부분
    return (
        <ListGroup.Item> {/* ListGroup.Item을 사용하여 작업 항목을 리스트 항목으로 렌더링합니다. */}
            {/* 작업 완료 상태를 표시하고, 완료 상태를 토글하는 체크박스 */}
            <Form.Check
                type="checkbox" // 체크박스 타입
                checked={task.completed} // 작업의 완료 상태에 따라 체크박스의 선택 상태를 설정합니다.
                onChange={() => toggleTask(task.id)} // 체크박스를 클릭할 때 작업의 완료 상태를 토글하는 함수 호출
                label={
                    <span style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
                        {/* 작업 제목을 렌더링합니다. 완료된 작업은 취소선 스타일을 적용합니다. */}
                        {task.title} <small>({task.tags.join(', ')})</small>
                        {/* 작업에 할당된 태그를 쉼표로 구분하여 렌더링합니다. */}
                    </span>
                }
            />
            {/* 작업 삭제 버튼 */}
            <Button 
                variant="danger" // 버튼 스타일을 붉은색으로 설정합니다.
                size="sm" // 버튼 크기를 작게 설정합니다.
                onClick={() => deleteTask(task.id)} // 버튼 클릭 시 작업을 삭제하는 함수 호출
                className="float-end" // 버튼을 오른쪽 끝으로 정렬합니다.
            >
                삭제
            </Button>
        </ListGroup.Item>
    );
}

export default TaskItem;

```

TagFilter.jsx

```jsx
// React 라이브러리를 임포트합니다. React는 컴포넌트를 생성하는 데 필요합니다.
import React from 'react';
// Zustand 상태 관리를 위한 useTaskStore 훅을 임포트합니다. 이 훅을 통해 전역 상태에 접근합니다.
import useTaskStore from '../store/useTaskStore';
// React-Bootstrap의 Form 컴포넌트를 임포트하여 UI를 스타일링합니다.
import { Form } from 'react-bootstrap';

// TagFilter 컴포넌트를 정의합니다. 이 컴포넌트는 작업 필터링을 위한 태그 선택 기능을 제공합니다.
function TagFilter() {
    // Zustand 스토어에서 태그 목록과 선택된 태그 상태를 가져옵니다.
    const tags = useTaskStore((state) => state.tags);
    const selectedTag = useTaskStore((state) => state.selectedTag);
    const setSelectedTag = useTaskStore((state) => state.setSelectedTag);

    // 현재 상태의 태그 목록을 콘솔에 로그로 출력하여 디버깅에 도움을 줍니다.
    console.log(tags);

    // 컴포넌트의 렌더링 부분
    return (
        <Form.Group className="mb-3">
            {/* 태그 필터링 레이블 */}
            <Form.Label>Filter by Tag</Form.Label>
            {/* 선택 상자 (드롭다운 메뉴) */}
            <Form.Control
                as="select" // 드롭다운 선택 상자로 렌더링합니다.
                value={selectedTag} // 선택된 태그를 드롭다운의 현재 값으로 설정합니다.
                onChange={(e) => setSelectedTag(e.target.value)} // 선택이 변경되면 상태를 업데이트하는 함수 호출
            >
                {/* 'All' 옵션을 제공하여 모든 태그를 표시하도록 설정할 수 있습니다. */}
                <option value="ALL">All</option>
                {/* 태그 목록을 매핑하여 각 태그를 드롭다운 옵션으로 렌더링합니다. */}
                {tags.map(tag => (
                    <option key={tag} value={tag}>{tag}</option>
                ))}
            </Form.Control>
        </Form.Group>
    );
}

// TagFilter 컴포넌트를 다른 파일에서 사용할 수 있도록 내보냅니다.
export default TagFilter;

```

FilterForm.jsx

```jsx
// React 라이브러리를 임포트합니다. React는 컴포넌트를 정의하고 렌더링하는 데 필요합니다.
import React from 'react';
// Zustand 상태 관리를 위한 useTaskStore 훅을 임포트합니다. 이 훅을 통해 전역 상태에 접근합니다.
import useTaskStore from '../store/useTaskStore';
// React-Bootstrap의 ButtonGroup 및 Button 컴포넌트를 임포트하여 버튼 그룹을 스타일링합니다.
import { ButtonGroup, Button } from 'react-bootstrap';

// FilterForm 컴포넌트를 정의합니다. 이 컴포넌트는 작업 필터링을 위한 버튼 그룹을 제공합니다.
function FilterForm() {
    // Zustand 스토어에서 setFilter 함수를 가져옵니다. 이 함수는 필터를 설정하는 데 사용됩니다.
    const setFilter = useTaskStore((state) => state.setFilter);

    // 컴포넌트의 렌더링 부분
    return (
        // ButtonGroup 컴포넌트를 사용하여 버튼들을 그룹화합니다. 버튼 그룹에 아래쪽 마진을 추가하여 간격을 조절합니다.
        <ButtonGroup className="mb-3">
            {/* 전체 작업 보기 버튼 */}
            <Button 
                variant="secondary" // 버튼의 스타일을 설정합니다. 여기서는 'secondary' 변형을 사용합니다.
                onClick={() => setFilter('ALL')} // 버튼 클릭 시 필터를 'ALL'로 설정합니다.
            >
                전체
            </Button>
            {/* 완료된 작업 보기 버튼 */}
            <Button 
                variant="secondary" // 버튼의 스타일을 설정합니다.
                onClick={() => setFilter('COMPLETED')} // 버튼 클릭 시 필터를 'COMPLETED'로 설정합니다.
            >
                완료
            </Button>
            {/* 미완료 작업 보기 버튼 */}
            <Button 
                variant="secondary" // 버튼의 스타일을 설정합니다.
                onClick={() => setFilter('INCOMPLETE')} // 버튼 클릭 시 필터를 'INCOMPLETE'로 설정합니다.
            >
                미완료
            </Button>
        </ButtonGroup>
    );
}

// FilterForm 컴포넌트를 다른 파일에서 사용할 수 있도록 내보냅니다.
export default FilterForm;

```

TaskList.jsx 

```jsx
// React 및 useEffect 훅을 임포트합니다. React는 컴포넌트를 정의하고 렌더링하는 데 필요합니다.
// useEffect는 컴포넌트가 마운트될 때와 업데이트될 때 특정 작업을 수행하는 데 사용됩니다.
import React, { useEffect } from 'react';
// Zustand에서 생성한 상태 관리 훅을 임포트합니다. 이 훅을 통해 상태와 상태 관련 함수를 가져옵니다.
import useTaskStore from '../store/useTaskStore';
// 개별 작업 항목을 표시하는 TaskItem 컴포넌트를 임포트합니다.
import TaskItem from './TaskItem';
// 로딩 상태를 표시하는 Loader 컴포넌트를 임포트합니다.
import Loader from './Loader';
// 오류 메시지를 표시하는 ErrorNotification 컴포넌트를 임포트합니다.
import ErrorNotification from './ErrorNotification';
// React-Bootstrap의 ListGroup 컴포넌트를 임포트하여 작업 목록을 표시하는 데 사용합니다.
import { ListGroup } from 'react-bootstrap';

// TaskList 컴포넌트를 정의합니다. 이 컴포넌트는 작업 목록을 표시하고 로딩 상태 및 오류를 처리합니다.
function TaskList() {
    // useTaskStore 훅을 사용하여 상태와 상태 관련 함수를 가져옵니다.
    // fetchTasks: 작업을 가져오는 비동기 함수
    // filteredTasks: 필터링된 작업 목록을 반환하는 선택자 함수
    // isLoading: 로딩 상태를 나타내는 boolean
    // error: 오류 메시지를 저장하는 상태
    const { fetchTasks, filteredTasks, isLoading, error } = useTaskStore();

    // 컴포넌트가 마운트될 때 fetchTasks 함수를 호출하여 작업을 가져옵니다.
    useEffect(() => {
        fetchTasks(); // 작업을 가져오는 함수 호출
    }, [fetchTasks]); // 의존성 배열에 fetchTasks를 포함하여, fetchTasks 함수가 변경될 때만 이 효과가 실행됩니다.

    // 로딩 상태일 때 Loader 컴포넌트를 렌더링합니다.
    if (isLoading) return <Loader />;

    // 오류가 발생했을 때 ErrorNotification 컴포넌트를 렌더링합니다.
    if (error) return <ErrorNotification message={error} />;

    // 필터링된 작업 목록을 가져옵니다.
    const tasksToRender = filteredTasks();

    // 컴포넌트의 렌더링 부분
    return (
        // ListGroup 컴포넌트를 사용하여 작업 목록을 그룹화합니다.
        <ListGroup>
            {/* 작업 목록이 있을 때 */}
            {tasksToRender.length > 0 ? (
                // tasksToRender 배열을 순회하여 각 작업 항목을 TaskItem 컴포넌트로 렌더링합니다.
                tasksToRender.map((task) => (
                    <TaskItem key={task.id} task={task} /> // 각 작업 항목을 TaskItem 컴포넌트로 렌더링하며, 고유한 키를 지정합니다.
                ))
            ) : (
                // 작업이 없을 때
                <ListGroup.Item>No tasks available.</ListGroup.Item> // 작업이 없음을 알리는 메시지를 ListGroup.Item으로 렌더링합니다.
            )}
        </ListGroup>
    );
}

// TaskList 컴포넌트를 다른 파일에서 사용할 수 있도록 내보냅니다.
export default TaskList;

```

ErrorNotification.jsx

```jsx
// React를 임포트합니다. React는 컴포넌트를 정의하고 렌더링하는 데 필요합니다.
import React from 'react';
// React-Bootstrap의 Alert 컴포넌트를 임포트합니다. Alert 컴포넌트는 사용자가 쉽게 알림 메시지를 표시할 수 있도록 합니다.
import { Alert } from 'react-bootstrap';

// ErrorNotification 컴포넌트를 정의합니다. 이 컴포넌트는 오류 메시지를 사용자에게 표시합니다.
function ErrorNotification({ message }) {
    // 컴포넌트의 렌더링 부분
    return (
        // Alert 컴포넌트를 사용하여 오류 메시지를 시각적으로 표시합니다.
        // variant="danger" 속성은 경고의 스타일을 'danger'로 설정하여 빨간색 배경과 흰색 텍스트로 오류를 강조합니다.
        <Alert variant="danger">
            {/* 오류 메시지를 Alert 컴포넌트의 내용으로 표시합니다. */}
            {message}
        </Alert>
    );
}

// ErrorNotification 컴포넌트를 다른 파일에서 사용할 수 있도록 내보냅니다.
export default ErrorNotification;

```

Loader.jsx

```jsx
// React를 임포트합니다. React는 컴포넌트를 정의하고 렌더링하는 데 필요합니다.
import React from 'react';
// React-Bootstrap의 Spinner 컴포넌트를 임포트합니다. Spinner는 로딩 상태를 표시하는 데 사용됩니다.
import { Spinner } from 'react-bootstrap';

// Loader 컴포넌트를 정의합니다. 이 컴포넌트는 로딩 상태를 시각적으로 표시합니다.
function Loader() {
    // 컴포넌트의 렌더링 부분
    return (
        // div 요소를 사용하여 Spinner 컴포넌트를 감쌉니다.
        // "text-center" 클래스는 내용을 중앙 정렬합니다.
        // "my-3" 클래스는 상하 마진을 추가하여 컴포넌트 주변에 여백을 만듭니다.
        <div className="text-center my-3">
            {/* Spinner 컴포넌트를 사용하여 로딩 애니메이션을 표시합니다.
                animation="border" 속성은 스피너의 애니메이션을 'border' 스타일로 설정합니다.
                이 스타일은 일반적으로 테두리 형태의 회전 애니메이션을 생성합니다. */}
            <Spinner animation="border" />
        </div>
    );
}

// Loader 컴포넌트를 다른 파일에서 사용할 수 있도록 내보냅니다.
export default Loader;

```

App.js

```javascript
// React를 임포트합니다. React는 컴포넌트를 정의하고 렌더링하는 데 필요합니다.
import React from 'react';
// 다양한 컴포넌트를 임포트합니다. 이 컴포넌트들은 UI를 구성하는 데 사용됩니다.
import TaskList from './components/TaskList'; // 작업 목록을 표시하는 컴포넌트
import TaskForm from './components/TaskForm'; // 새로운 작업을 추가하는 폼 컴포넌트
import FilterForm from './components/FilterForm'; // 작업 필터링 버튼을 제공하는 컴포넌트
import TagFilter from './components/TagFilter'; // 태그 기반 작업 필터링 컴포넌트
// React-Bootstrap의 컨테이너, 행, 열 및 카드 컴포넌트를 임포트합니다. 레이아웃과 스타일링을 위해 사용됩니다.
import { Container, Row, Col, Card } from 'react-bootstrap';

// App 컴포넌트를 정의합니다. 이 컴포넌트는 전체 애플리케이션의 레이아웃을 설정합니다.
function App() {
  return (
    // Container 컴포넌트는 페이지의 중앙에 맞춰 콘텐츠를 감싸며, 전체 페이지에 여백을 추가합니다.
    // "my-4" 클래스는 상하 마진을 추가하여 전체 페이지에 여백을 만듭니다.
    <Container className="my-4">
      {/* Card 컴포넌트는 내용이 포함된 카드를 생성하며, 일반적으로 UI의 섹션을 구분하는 데 사용됩니다. */}
      <Card>
        {/* Card.Header는 카드의 헤더 부분을 정의합니다. 이곳에는 카드 제목이나 헤더 텍스트가 포함됩니다. */}
        <Card.Header as="h1" className="text-center">Advanced Task Management App with Zustand</Card.Header>
        {/* Card.Body는 카드의 본문 부분을 정의합니다. 본문에는 카드의 주요 내용이 포함됩니다. */}
        <Card.Body>
          {/* Row 컴포넌트는 그리드 레이아웃의 행을 정의합니다. */}
          <Row className="mb-3">
            {/* Col 컴포넌트는 그리드 레이아웃의 열을 정의합니다. md 속성은 중간 화면 크기에서 열의 크기를 설정합니다. */}
            <Col md={4}>
              {/* 작업 필터를 위한 카드 컴포넌트 */}
              <Card>
                <Card.Header>Filters</Card.Header>
                <Card.Body>
                  {/* FilterForm 컴포넌트는 작업 필터링 버튼을 제공합니다. */}
                  <FilterForm />
                  {/* TagFilter 컴포넌트는 태그를 기반으로 작업을 필터링할 수 있는 드롭다운을 제공합니다. */}
                  <TagFilter />
                </Card.Body>
              </Card>
            </Col>
            <Col md={8}>
              {/* 새로운 작업을 추가하는 카드 컴포넌트 */}
              <Card>
                <Card.Header>Add New Task</Card.Header>
                <Card.Body>
                  {/* TaskForm 컴포넌트는 새로운 작업을 추가하는 폼을 제공합니다. */}
                  <TaskForm />
                </Card.Body>
              </Card>
              {/* 작업 목록을 표시하는 카드 컴포넌트 */}
              <Card className="mt-3">
                <Card.Header>Task List</Card.Header>
                <Card.Body>
                  {/* TaskList 컴포넌트는 현재 작업 목록을 표시합니다. */}
                  <TaskList />
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
}

// App 컴포넌트를 다른 파일에서 사용할 수 있도록 내보냅니다.
export default App;

```

index.js

```javascript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```