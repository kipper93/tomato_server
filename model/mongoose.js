/* 
  mongoose.js ：建立数据库连接
 */
const { MongoClient } = require('mongodb')

// const url = 'mongodb://test:123@127.0.0.1/tomatobase?authSource=admin'
const url = 'mongodb://localhost:27017/tomatobase?authSource=admin'

const client = new MongoClient(url);

const dbName = 'tomatobase'

const getHomeData = async () => {
  await client.connect();
  const db = client.db(dbName);
  const collection = db.collection('tomato_home');
  const array = await collection.find().sort({ "date": -1 }).toArray();
  console.log(array);
  client.close();
  return array;
};


const getMemorial_listData = async () => {
  await client.connect();
  const db = client.db(dbName);
  const collection = db.collection('tomato_memorial_url');
  const array = await collection.find().toArray();
  // console.log(array);
  client.close();
  return array;
};


const setHomeData = async (data) => {
  let MongoClientw = require('mongodb').MongoClient;
  const url = 'mongodb://localhost:2017/tomatobase?authSource=admin'
   
  MongoClientw.connect(url, function(err, db) {
      if (err) throw err;
      let dbo = db.db("tomatobase");
      dbo.collection("tomato_home").insertOne(myobj, function(err, res) {
          if (err) throw err;
          console.log("文档插入成功");
          db.close();
      });
  });

};




module.exports = {
  getHomeData,
  getMemorial_listData,
  setHomeData
}