var express = require('express');
var bodyparser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;

var app = express();

// Static file hosting
app.use(express.static('statisch'));

// Connect to database
var db;
var chatMessages;
MongoClient.connect('mongodb://localhost:27017/myproject2', function (err, _db) {
  if (err) throw err;
  console.log("Connected to MongoDB");

  db = _db;
  chatMessagesTable = db.collection('chatMessages');
});

// Disconnect after CTRL+C
process.on('SIGINT', function() {
  console.log("Shutting down Mongo connection");
  db.close();
  process.exit(0);
});

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/api/chat', function (req, res) {
  chatMessagesTable.find().toArray(function (err, chatMessages) {
    // TODO Handle error
    res.status(200).json(chatMessages);
  });
});

app.use(bodyparser.json());

app.post('/api/addMessage', function (req, res) {
  newChatMessage = { 'nickname': req.body.nickname, 'message': req.body.message, 'posted_on': req.body.posted_on };
  chatMessagesTable.insert(newChatMessage, function (err, result) {
    // TODO Handle error
    chatMessagesTable.find().toArray(function (err, students) {
      // TODO Handle error
      res.status(201).json(chatMessages);
    });
  });
});




app.listen(3000);
