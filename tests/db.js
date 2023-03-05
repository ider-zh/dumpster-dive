const { MongoClient } = require('mongodb');

const open = function (dbName, callback) {
  const url = 'mongodb://localhost:27017/' + dbName;

  MongoClient.connect(url, { useUnifiedTopology: true, useNewUrlParser: true })
    .then(client=>{
      const db = client.db(dbName);
      callback(db, client);
    })
    .catch(error=>{
      console.log(error);
      process.exit(1);
    })
};

//count all pages
const count = function (dbName, cb) {
  open(dbName, function (db, client) {
    const col = db.collection('pages');
    col.countDocuments().then((len) => {
      client.close();
      cb(len);
    });
  });
};

//grab a couple
const firstTen = function (dbName, cb) {
  open(dbName, function (db, client) {
    const col = db.collection('pages');
    col.find({}).limit(10).toArray().then(docs=>{
      // docs = docs.slice(0, 10);
      client.close();
      cb(docs);
    }).catch(err=>{
      console.log(err);
    })

    // col.find({}).limit(10).toArray(function (err, docs) {
    //   if (err) {
    //     console.log(err);
    //   }
    //   client.close();
    //   cb(docs);
    // });

  });
};

//delete all pages
const drop = function (dbName, colName, cb) {
  open(dbName, function (db, client) {
    db.collection('pages');
    const col = db.collection(colName);
    // console.log('dropping ' + colName)
    col.deleteMany({});
    setTimeout(function () {
      client.close();
      cb();
    }, 2000);
  });
};

module.exports = {
  count: count,
  drop: drop,
  firstTen: firstTen
};
// firstTwo('tempwiki', console.log)
// open('tempwiki', console.log)
// drop('smallwiki', 'pages',console.log)
