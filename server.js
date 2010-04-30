var http = require('http'),
    port = process.env.PORT || 8001,
    mongo = require('./vendor/node-mongodb-native/lib/mongodb')

http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'})
  res.write("<h1>Squirrels FTW!</h1>")

  var db = new mongo.Db('squirrel-node', new mongo.Server("flame.local.mongohq.com", 27024, {}))
  db.open(function(err, db) {
    db.authenticate("squirrel", "password", function(err, replies) {
      if (err) {
        res.write("<h3>UNAUTH!!! " + err + "</h3>")
      }
      db.collection('squirrels', function(err, collection) {
        collection.find({}, {'sort':[['name', 1]]}, function(err, cursor) {
          cursor.each(function(err, squirrel) {
            if (squirrel) {
              res.write(squirrel.name + "<br />")            
            } else {
              res.end("<h2>Thanks!</h2>")
            }
          })
        })
      })
    })
  })
}).listen(parseInt(port))
