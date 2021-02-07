# 쇼핑몰 홈페이지 만들어보기

- node.js
- React.js
- MongoDB

### 2021-02-04

- FISRT INIT

### 2021-02-06

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
- 파일이 저장될 경로인 uploads/ 는 프로젝트 루트에 설정하도록 하였다.

#### 이미지 삭제

- 업로드한 이미지를 클릭하면 리스트에서 삭제함
- 사진을 클릭할 경우 이미지의 인덱스를 불러옴
- 이미지 배열을 복사해서 해당 인덱스의 이미지를 삭제함
- 배열을 state에 덮어씌움

#### 부모컴포넌트로 이미지 정보 넘김

- props으로 부모에서 함수를 넘겨서 콜백으로 값이 저장되도록 함

#### 상품 정보 저장하기

- server의 models 폴더에 스키마를 생성한다.
- 저장할때 writer는 쿠키에 저장해둔 로컬 스토리지에서 해도 되고, Auth를 통과할때 각 컴포넌트가 받은 user props를 이용해서 사용자 정보를 가져와도 된다.

### 2021-02-07

#### 첫페이지 목록

- 첫페이지에 나오는 화면 구성(LandingPage.js)
- UI는 Ant Design의 Card를 이용해서 구성할거임
- 이미지는 배열로 들어오기 때문에 슬라이드 형태로 돌아가도록 설정(Ant Design -> Carousel)
- util에 ImageSlider로 컴포넌트 제작후 부착

#### 더보기 버튼

몽고디비 메서드

- LIMIT : 몽고디비에서 처음 데이터를 가져올때 갯수, 더보기를 버튼을 눌러서 얼마나 가져올건지
- SKIP : 어디서 부터 데이터를 가져오는지에 대한 메서드, 처음에는 0부터 시작, Limit이 6 이라면 다르면 스킵에는 0+6으로 시작함
- 더보기를 눌렀을 때는 서버로 던지는 파라미터 body에 플래그를 주어서 돌아오는 값에서 기존 상품(배열)에 추가분이 붙을 수 있도록 함

#### 검색 기능

#### Check Box

- 체크박스로 검색기능을 할때 LandingPage 내에 Section 폴더를 만들어서 검색 조건에 해당하는 데이터를 불러옴
- UI 제작 Collapse 사용(Ant Design)
- 별도로 컴포넌트를 만들어서 부모 컴포넌트로 값을 넘김
- 값을 넘겨 받아서 서버에 조건을 넘기는데

```
  Product.find(findArgs)
  findArgs => continents: [ 2, 3 ]
```

- findArgs는 JSON 형태의 데이터 타입이다. 당연하게도 컬럼명과 JSON의 KEY값은 같아야 한다.
  server에 있는 product.js의 57번째 라인을 참고 하자. 넘어온 값이 있으면 해당 값의 키값에 맞는 조건을 형성해서 서버에 보낸다.

#### Radio Button

- Radio Group 은 AntDesign 으로 만들었고 원리는 CheckBox랑 비슷하다.

```
 if(key==="price"){
        findArgs[key] = {
          $gte : req.body.filters[key][0],
          $lte : req.body.filters[key][1],
        }
      }
```

mongodb에 값을 던져 줄때

1. $gte(Greater than equal)
2. $lte(Less than equal)
   을 사용하여 값의 범위를 던져준다.

#### Text Filter

- 원리는 똑같음
- 자식 컴포넌트(SearchFeature) 를 만들어서 부모 컴포넌트로 값을 넘김
- 누를때 마다 getProducts() 가 작동될거임
- 텍스트 검색을 할때는 .find()를 한번 더 돌려줘야함

```
    Product.find(findArgs)
    .find({$text:{$search:term}}) //텍스트적용 하는곳
    .populate("writer")
    .skip(skip) //가져올 인덱스 전달
    .limit(limit)// 몽고디비에 가져올 숫자를 던져줌
    .exec((err,productsInfo)=>{
      if(err) return res.status(400).json({success:false,err})
      //돌아오는 값에 컬렉션 갯수를 추가해줌(postSize)
      res.status(200).json({success:true,productsInfo,postSize : productsInfo.length})
    })
```

```
https://docs.mongodb.com/manual/reference/operator/query/text/
```

설명은 위에서 해줌

1. Model 의 필드를 수정해줘야함
2. 검색할때 어디에 걸려야 하는지 혹은 어디에 중점적으로 걸려야하는지 옵션을 넣어줘야 함

```
  productSchema.index({
      title:'text',
      description:'text'
  },{
      weights:{
          title:5,
          description :1
      }
  })
```

스키마에서 title과 description에 text 검색이 가능하도로고 조건을 부여하고
중요도는 title에 5를 description에 1을 부여하여 검색시 title이 우선적으로 나오도록 한다.
title은 5배
description은 1배
weight을 설정하지 않는 경우 default 값으로 1이 부여 된다.

- 왜 검색을 할때 like 검색이 안되는지 모르겠다...
- regex를 사용하면 칼럼에 대해서 like 검색이 되긴 되는데, text로는 왜 안되는지 찾아보겠음

```
  Product.find(findArgs)
    .find({
      "title": { '$regex': term },
      "description": { '$regex': term },
   })
    ...
```

위의 부분이 바꾸면 되긴함
