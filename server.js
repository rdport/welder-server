const http = require('http');
const app = require('./app.js');
const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log('App is running on PORT: ', PORT);
})
