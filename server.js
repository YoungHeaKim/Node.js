const express = require("express")
const app = express()
const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: false}))
// express가 ejs를 템플릿 엔진으로 사용 가능하게 셋팅
app.set('view engine', 'ejs')
// static 라우트를 추가한다.
app.use('/static', express.static('public'))
//HTTP 로그를 남겨주는 코드
const morgan = require('morgan')
app.use(morgan('tiny'))

const data = [{
  num: 1,
  title: 'hi',
  body: '',
  author:'나나나나나',
}]

// 첫 화면
app.get('/', (req, res) => {
  res.render('main.ejs', {data})
})

// 새글창으로 보내는 화면
app.get('/new', (req, res) => {
  res.render('new.ejs')
})

// 
app.get('/content/:num', (req, res) => {
  const num = parseInt(req.params.num)
  const matched = [...data].find(item => item.num === num)
  if(matched){
    res.render('content.ejs', {matched})
  } else {
    res.status(404)
    res.send('404 Not Found')
  }
})

app.post('/', (req, res) => {
  const title = req.body.title
  const body = req.body.body
  const author = req.body.author  
  const num = data.length+1
  data.push({num, title, author})
  res.redirect('/')
})

// 4001번 포트
app.listen(4002, () => {
  console.log("listening")
})