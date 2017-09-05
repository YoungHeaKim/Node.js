const express = require("express")
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan') // HTTP 로그남겨주는 것
// 로그인 실행
var basicAuth = require('express-basic-auth')

app.use(bodyParser.urlencoded({ extended: false}))
// express가 ejs를 템플릿 엔진으로 사용 가능하게 셋팅
app.set('view engine', 'ejs')
// static 라우트를 추가한다.
app.use('/static', express.static('public'))
//HTTP 로그를 남겨주는 코드
app.use(morgan('tiny'))

const data = [{
  num: 1,
  title: 'hi',
  body: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Obcaecati nemo illo, blanditiis temporibus tempore quos porro voluptates sapiente similique dicta repellendus modi error exercitationem hic deleniti molestiae laudantium possimus unde!',
  author:'나야나',
}]
const comment = [{
  num: 1,
  nickName: '나요',
  comments: 'goodgood',
}]

// 로그인 관련
const authMiddleware = basicAuth({
  users: { 'admin': 'admin' },
  challenge: true,
  realm: 'Imb4T3st4pp'
})

// 첫 화면
app.get('/', (req, res) => {
  res.render('main.ejs', {data})
})

// admin page
app.get('/admin', authMiddleware, (req, res) => {
  res.render('admin.ejs', {data})
})

// 새글창으로 보내는 화면
app.get('/new', (req, res) => {
  res.render('new.ejs')
})

app.get('/content/:num', (req, res) => {
  const num = parseInt(req.params.num)
  const matched = [...data].find(item => item.num === num)
  const matchedCom = [...comment].filter(item => item.num === num)
  if(matched && matchedCom){
    res.render('content.ejs', {matched, matchedCom})
  } else {
    res.status(404)
    res.send('404 Not Found')
  }
})

app.post('/', (req, res) => {
  const title = req.body.title
  const body = req.body.body
  const author = req.body.author  
  const num = data.length + 1
  console.log(num)
  data.push({num, title, author, body})
  res.redirect('/')
})

app.post('/content/:num', (req, res) => {
  const num = parseInt(req.params.num)
  const nickName = req.body.nickName
  const comments = req.body.comments
  comment.push({num, comments, nickName})
  res.redirect('/content/'+num)
})

app.post('/admin/:num', authMiddleware, (req, res) => {
  const num = parseInt(req.params.num)
  data.splice(num - 1, 1);
  res.redirect('/admin')
})

// 4001번 포트
app.listen(4003, () => {
  console.log("listening")
})