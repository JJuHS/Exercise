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
