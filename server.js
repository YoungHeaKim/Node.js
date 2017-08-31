const express = require("express")
const app = express()



app.get('/', (req, res) => {
  res.send("hello")
})

// 4000번 포트
app.listen(4000, () => {
  console.log("listening")
})