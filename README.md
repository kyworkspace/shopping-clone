# 쇼핑몰 홈페이지 만들어보기

- node.js
- React.js
- MongoDB

#### 2021-02-04

- FISRT INIT

#### 2021-02-06

- 업로드 페이지 생성
- navBar에 업로드 페이지 버튼 생성
- select 이벤트는 일반 자바스크립트랑 구조가 다를게 없음. onChange 이벤트 걸어주고 select State 교체
- DropZone 코드는 다른곳에서 쓸수 있도록 utils폴더로 별도로 관리하여 컴포넌트만 받아 쓸수 있도록 함

  https://www.npmjs.com/package/react-dropzone

- 드랍존 기본 코드 참고
- 사진을 올리면 백에 저장을 하고 그것을 다시 리턴시켜서 프론트에서 표출 되도록 함
- file을 던질때 formdata를 제대로 맞춰서 주지 않으면 실해되지 않음
- multer 라이브러리 필요함
- multer 라이브러리는 server에서 처리하는 것이기 때문에 client 루트가 아닌 서버 폴더, 즉 프로젝트 루트 디렉토리에서

  npm install multer --save

를 실행한다.

    https://www.npmjs.com/package/multer

multer 참고

- 이미지를 하나만 쓸것이 아니기 때문에 spread Operator를 이용해서 배열로 받도록 한다.
