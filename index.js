const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;


const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://seoha:1234@selena.z9owk.mongodb.net/selena?retryWrites=true&w=majority',{
    useNewUrlParser:true, useUnifiedTopology:true,useCreateIndex:true,useFindAndModify:false
}).then(()=>console.log('mongoDB connected..'))
.catch(err=>console.log(err))

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});