# 📌 할 일(Todo) 관리 앱

주어진 API를 활용해 '[완성 예시](https://todo-vite-vue3-composition-ts.vercel.app/)' 처럼 할 일(Todo) 관리 기능을 구현합니다.  

이 앱에서 사용한 주요 라이브러리는 다음과 같습니다.

- `react-router-dom`: React 앱의 라우팅 라이브러리로, URL과 컴포넌트의 매핑을 쉽게 처리할 수 있습니다.
- `framer-motion`: 복잡한 애니메이션과 제스처를 쉽게 구현할 수 있는 라이브러리입니다.
- `axios`: HTTP 클라이언트 라이브러리로, 브라우저와 Node.js에서 모두 사용 가능합니다.
- `zustand`: 상태 관리를 간편하게 할 수 있는 작지만 강력한 상태 관리 라이브러리입니다.
- `@tanstack/react-query`: 데이터 패칭과 캐싱 등을 간편하게 처리할 수 있는 라이브러리입니다.
- `sortablejs`: 드래그 앤 드롭 기능으로 목록을 정렬하거나 재배치할 수 있는 기능을 제공합니다.
- `sass`: CSS 전처리기로 CSS보다 더 나은 문법과 기능을 제공합니다.
- `clsx`: 조건부 CSS 클래스를 동적으로 조합하는 유틸리티입니다.
- `vercel`: Vercel에서 제공하는 배포 도구로, 자동 배포, 서버리스 함수 등의 기능을 지원합니다.
- `concurrently`: 여러 개의 스크립트 명령을 동시에(병렬) 실행할 수 있게 해주는 유틸리티입니다.
- `dotenv`: 환경 변수 관리를 위한 라이브러리로, `.env` 파일에 정의된 변수를 사용할 수 있게 해줍니다.

![완성 예시](./screenshots/ss1.JPG)  
![완성 예시](./screenshots/ss2.JPG)

## Vercel

### Vercel SPA Fallback

Browser Router 모드에서 단일 페이지 앱(SPA)을 제공할 때는 적절한 서버 구성이 필요합니다.     
우리는 Vercel 호스팅을 사용하므로, 모든 경로에 대해 `index.html` 파일을 제공할 수 있게 다음과 같이 옵션을 제공합니다.

https://vercel.com/docs/concepts/projects/project-configuration#legacy-spa-fallback

__/vercel.json__

```json
{
  "routes": [
    { "handle": "filesystem" },
    { "src": "/(.*)", "dest": "/index.html" }
  ]
}
```

## API 정보

모든 요청은 다음 Headers 정보가 필수로 포함돼야 합니다.   
`<TODO_APIKEY>`와 `<TODO_USERNAME>` 정보는 별도 제공합니다.

```curl
curl <API_ENDPOINT>
  \ -X <REQUEST_METHOD>
  \ -H 'content-type: application/json'
  \ -H 'apikey: <TODO_APIKEY>'
  \ -H 'username: <TODO_USERNAME>'
``` 


### 할 일 목록 조회

전체 할 일 목록을 조회합니다.

```curl
curl https://asia-northeast3-heropy-api.cloudfunctions.net/api/todos
  \ -X 'GET'
```

__요청 데이터 타입 및 예시:__

- N/A

__응답 데이터 타입 및 예시:__

```ts
type ResponseValue = Todo[] // 할 일 목록

interface Todo {
  id: string // 할 일 ID
  order: number // 할 일 순서
  title: string // 할 일 제목
  done: boolean // 할 일 완료 여부
  createdAt: string // 할 일 생성일
  updatedAt: string // 할 일 수정일
}
```

```json
[
  {
    "id": "mnIwaAPIAE1ayQmqekiR",
    "order": 0,
    "title": "JS 공부하기",
    "done": false,
    "createdAt": "2021-10-28T05:18:51.868Z",
    "updatedAt": "2021-10-28T05:18:51.868Z"
  },
  {
    "id": "tMzPImGoWtRdJ6yyVv2y",
    "order": 1,
    "title": "과제 PullRequest(PR) 생성",
    "done": true,
    "createdAt": "2021-10-28T04:16:53.980Z",
    "updatedAt": "2021-10-28T09:40:17.955Z"
  },
  {
    "id": "Rq8BebKihCgteHHhMIRS",
    "order": 2,
    "title": "API 스터디",
    "done": false,
    "createdAt": "2021-10-28T04:17:02.510Z",
    "updatedAt": "2021-10-28T04:17:02.510Z"
  }
]
```


### 할 일 항목 추가

할 일 항목을 새롭게 추가합니다.

```curl
curl https://asia-northeast3-heropy-api.cloudfunctions.net/api/todos
  \ -X 'POST'
```

__요청 데이터 타입 및 예시:__

```ts
interface RequestBody {
  title: string // 할 일 제목
  order?: number // 할 일 순서
}
```

```json
{
  "title": "KDT 과정 설계 미팅"
}
```

__응답 데이터 타입 및 예시:__

```ts
interface ResponseValue {
  id: string
  order: number
  title: string
  done: boolean
  createdAt: string
  updatedAt: string
}
```

```json
{
  "id": "7P8dOM4voAv8a8cfoeKZ",
  "order": 0,
  "title": "KDT 과정 설계 미팅",
  "done": false,
  "createdAt": "2021-10-29T07:20:02.749Z",
  "updatedAt": "2021-10-29T07:20:02.749Z"
}
```


### 할 일 항목 수정

특정 할 일 항목을 수정합니다.

```curl
curl https://asia-northeast3-heropy-api.cloudfunctions.net/api/todos/:todoId
  \ -X 'PUT'
```

__요청 데이터 타입 및 예시:__

```ts
interface RequestBody {
  title: string // 할 일 제목
  done: boolean // 할 일 완료 여부
  order?: number // 할 일 순서
}
```

```json
{
  "title": "Bootstrap 스타일 추가",
  "done": false
}
```

__응답 데이터 타입 및 예시:__

```ts
interface ResponseValue {
  id: string
  order: number
  title: string
  done: boolean
  createdAt: string
  updatedAt: string
}
```

```json
{
  "id": "7P8dOM4voAv8a8cfoeKZ",
  "title": "Bootstrap 스타일 추가",
  "done": false,
  "order": 2,
  "createdAt": "2021-10-29T07:20:02.749Z",
  "updatedAt": "2021-10-29T07:20:02.749Z"
}
```


### 할 일 항목 삭제

특정 할 일 항목을 삭제합니다.

```curl
curl https://asia-northeast3-heropy-api.cloudfunctions.net/api/todos/:todoId
  \ -X 'DELETE'
```

__요청 데이터 타입 및 예시:__

- N/A

__응답 데이터 타입 및 예시:__

```ts
type ResponseValue = true // 정상 응답
```


### 할 일 항목 일괄 삭제

```curl
curl https://asia-northeast3-heropy-api.cloudfunctions.net/api/todos/deletions
  \ -X 'DELETE'
```

__요청 데이터 타입 및 예시:__

```ts
interface RequestBody {
  todoIds: string[] // 삭제할 할 일 ID 목록
}
```

```json
{
  "todoIds": [
    "mnIwaAPIAE1ayQmqekiR",
    "tMzPImGoWtRdJ6yyVv2y",
    "GHrvr3LaPx1g7y2sNuaC",
    "Rq8BebKihCgteHHhMIRS"
  ]
}
```

__응답 데이터 타입 및 예시:__

```ts
type ResponseValue = true // 정상 응답
```


### 할 일 목록 순서 변경

할 일 목록의 순서를 변경합니다.  

```curl
curl https://asia-northeast3-heropy-api.cloudfunctions.net/api/todos/reorder
  \ -X 'PUT'
```

__요청 데이터 타입 및 예시:__

```ts
interface RequestBody {
  todoIds: string[] // 새롭게 정렬할 할 일 ID 목록
}
```

```json
{
  "todoIds": [
    "mnIwaAPIAE1ayQmqekiR",
    "tMzPImGoWtRdJ6yyVv2y",
    "GHrvr3LaPx1g7y2sNuaC",
    "Rq8BebKihCgteHHhMIRS"
  ]
}
```

__응답 데이터 타입 및 예시:__

```ts
type ResponseValue = true // 정상 응답
```
