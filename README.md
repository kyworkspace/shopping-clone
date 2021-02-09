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

### Detail Page

#### Route & Data Load

```
  <Card
        cover={<a href={`/product/${product._id}`}> <ImageSlider images={product.images}/> </a>}
    >
```

- 카드에서 커버를 누르면 디테일로 들어가도록 수정
  App.js 에서 URL 은

```
  /product/:productId
```

위와 같이 ID를 받아서 쓸수 있도록 함.
Detail Page에서는 API를 통해 정보를 불러와야하 하는데, 이때는 URL에 포함된 productId 정보를 바탕으로 가져올수 있도록 한다.
아래와 같이 가져올 수 있다.

```
  const productId = props.match.params.productId;
```

요청을 보낼때 하나만 가져올 것이기 때문에 쿼리스트링 옵션에 type=single을 추가해준다.

```
  Axios.get(`/api/product/product_by_id?id=${productId}&type=single`)
```

라우터에서 처리할때도 form에 담아 body로 보낸것이 아닌 get의 쿼리스트링으로 보낸 것이기 때문에

```
  router.get('/product_by_id',(req,res)=>{
    //productId를 이용해서 DB에서 같은 상품의 정보를 가져온다.
    let type = req.query.type;
    let productId = req.query.id;
    ...
  })
```

위와 같이 쿼리스트링에서 정보를 뽑아온다.

#### Detail Page UI

상세보기에서 사진을 띄우는데 라이브러리를 사용하면 훨씬 예쁘고 간단하게 뽑을수 있다.

```
  npm install react-image-gallery --save
```

리액트 개발자들은 천재인가보다.

- 디테일 페이지 폴더내에 섹션 폴더를 만들어서 이미지를 표출할 곳, 데이터를 보여줄 곳 . 2개의 컴포넌트를 만든다.

```
<ImageGallery items={}/>
```

item에 이미지를 넣어 주는데, original과 thumbnail을 구분해서 넣어줌

```
@import "~react-image-gallery/styles/scss/image-gallery.scss";
@import "~react-image-gallery/styles/css/image-gallery.css";
```

css는 index.css에 집어 넣도록 한다.

혹시나 썸네일을 만들고 싶을때는 gm 이라는 모듈을 사용하면 된다고 한다.

```
https://www.npmjs.com/package/gm

brew install imagemagick
brew install graphicsmagick
--위에꺼 2개 먼저 설치해줘야함

npm gm install --save
```

각설하고 돌아와서

```
props.detail.images.map(item=>{
                images.push({
                    original:`http://localhost:5000/${}`,
                    thumbnail:`http://localhost:5000/${}`
                })
            })
```

썸네일이 없기 때문에 둘다 같은 걸로 쓰는데, localhost로 부르는 모든 URL들은 배포할때 동적으로 해줘야 한다.
아니면 코드 꼬임

```
useEffect(() => {
        if(props.detail.images && props.detail.images.length > 0){ //등록된 이미지가 있는 경우
            let images=[];
            props.detail.images.map(item=>{
                images.push({
                    original:`http://localhost:5000/${item}`,
                    thumbnail:`http://localhost:5000/${item}`
                })
            })
            setImages(images)
        }
    }, [props.detail])
```

라이프 싸이클에서 useEffect를 할때 초기에는 props에 데이터가 없을거임 그래서 useEffect의 두번째 파라미터에 detail을 넣어줌
즉 detail 값이 바뀔때 마다 라이프싸이클을 작동시킨다는 뜻

### Add to Cart

- 장바구니 정보랑 구매이력 정보를 넣을 필드를 User 컬랙션에 추가해줌
- 유저정보는 리덕스에서 처리해 주었기 때문에 action과 reducer 로 처리하는데, action측에서 데이터 넘겨주기로함(/addToCart)
- 장바구니 안에 이미 상품이 있으면 +1
- 있지 않다면 1
- 카트에 추가된 정보를 리덕스에 저장

```
findOneAndUpdate(데이터 찾을 조건, 업데이트할 내용, 리턴받을때 어떻게 할건지, 콜백 함수)

            User.findOneAndUpdate(
                {_id : req.user._id,"cart.id":req.body.productId},
                //cart의 quantity를 올려줌
                // $inc --> increment
                {$inc:{"cart.$.quantity":1}},
                //리턴값을 업데이트 된 유저정보로 받기 위에서 new : true 옵션이 들어감
                {new : true},
                (err,userInfo)=>{
                    if(err) return res.status(200).json({success:false,err})
                    //카트정보만 돌려보냄
                    res.status(200).json(userInfo.cart)
                }
            )
```

- 리듀서에서 받을때는 cart 정보만 받기 때문에 기존 userData를 보존한채로 새로운거(cart) 추가

### Cart Page

- 장바구니 페이지
- 디테일 페이지를 벗어나면 auth를 거치면서 store에 담긴 회원 정보를 갱신하는데, 그안에 cart 정보를 넣어주지 않았기 때문에 안보이게 됨

```
router.get("/auth", auth, (req, res) => {
    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role === 0 ? false : true,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image,
        cart : req.user.cart, //장바구니 정보
        history: req.user.history,//결재 이력 정보
    });
});
```

- 보이도록 수정함

1. CartPage.js 생성

- 아이콘과 배지(Ant Design)을 이용해서 상부메뉴에 탭 노출
  1. 장바구니 안에 물품 목록이 있는지 확인
  2. 쿼리스트링으로 유저정보 안에 있는 cart안에 들어간 상품 ID들과 Quantity 정보를 합쳐줘야함
  3. 매개변수로 위의 데이터를 action으로 넘김
  ```
  dispatch(getCartItems(cartItems,props.user.userData.cart))
  ```
  4. 상품 디테일에서 썻던 코드를 재활용 함 , type 값으로 차별점을 둠
  ```
  const request = axios.get(`/api/product/product_by_id?id=${cartItems}&type=array`)
  ```
  cartItems는 카트에 담긴 상품의 ID의 배열임
  ```
  router.get('/product_by_id',(req,res)=>{
    //productId를 이용해서 DB에서 같은 상품의 정보를 가져온다.
    let type = req.query.type;
    let productIds = req.query.id;
    //type 이 싱글일때는 1개 정보만 가져오고
    //arry 일때는 여러개 가져옴 ==>id=11122,333,22211,....
    if(type==="array"){
      //productIds를 배열형태로 바꿔줘야함 [111222,333,22211,...]
      let ids = req.query.id.split(",")
      productIds = ids.map(item=>{
        return item;
      });
    }
    Product.find({_id:{$in:productIds}}) //$in은 배열안에 들어간 조건으로 값을 찾음
    ...
  })
  ```
  5. action에서 가져온 데이터와 비교해서 구매수량(quantity) 을 연결해줘야함
  ```
  export function getCartItems(cartItems,userCart){
    //상품을 여러개 가져와야함
    const request = axios.get(`/api/product/product_by_id?id=${cartItems}&type=array`)
    .then(response=>{
        //cartItem에 해당하는 Product Collection을 가져와서 Quatity 정보를 넣어줘야함
        console.log(userCart)
        userCart.forEach(item=>{
            // response안에 있는 상품의 id와 cart의 id를 비교해서
            response.data.product.forEach((productDetail,i)=>{
                //id가 같으면 quntity를 넣어줌
                if(item.id === productDetail._id){
                    response.data.product[i].quantity = item.quantity
                }
            })
        })
        return response.data;
    })
    return {
        type : GET_CART_ITEMS,
        payload : request
    }
  }
  ```
