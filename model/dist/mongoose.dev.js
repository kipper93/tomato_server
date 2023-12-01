"use strict";

/* 
  mongoose.js ：建立数据库连接
 */
var _require = require('mongodb'),
    MongoClient = _require.MongoClient; // 本地调试
// const url = 'mongodb://test:123@8.139.6.250/tomatobase?authSource=admin'
// 发布阿里云


var url = 'mongodb://test:123@127.0.1/tomatobase?authSource=admin';
var client = new MongoClient(url);
var dbName = 'tomatobase';

var getHomeData = function getHomeData() {
  var db, collection, array;
  return regeneratorRuntime.async(function getHomeData$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(client.connect());

        case 2:
          db = client.db(dbName);
          collection = db.collection('tomato_home');
          _context.next = 6;
          return regeneratorRuntime.awrap(collection.find().sort({
            "date": -1
          }).toArray());

        case 6:
          array = _context.sent;
          // console.log(array);
          client.close();
          return _context.abrupt("return", array);

        case 9:
        case "end":
          return _context.stop();
      }
    }
  });
};

var getMemorial_listData = function getMemorial_listData() {
  var db, collection, array;
  return regeneratorRuntime.async(function getMemorial_listData$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(client.connect());

        case 2:
          db = client.db(dbName);
          collection = db.collection('tomato_memorial_url');
          _context2.next = 6;
          return regeneratorRuntime.awrap(collection.find().toArray());

        case 6:
          array = _context2.sent;
          client.close();
          return _context2.abrupt("return", array);

        case 9:
        case "end":
          return _context2.stop();
      }
    }
  });
};

var setHomeData = function setHomeData(data) {
  var MongoClientw, url;
  return regeneratorRuntime.async(function setHomeData$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          MongoClientw = require('mongodb').MongoClient; // 发布阿里云

          url = 'mongodb://test:123@127.0.1/tomatobase?authSource=admin'; // 本地调试
          // const url = 'mongodb://test:123@8.139.6.250/tomatobase?authSource=admin'

          MongoClientw.connect(url, function (err, db) {
            if (err) throw err;
            var dbo = db.db("tomatobase");
            dbo.collection("tomato_home").insertOne(data, function (err, res) {
              if (err) throw err;
              console.log("文档插入成功");
              db.close();
            });
          });

        case 3:
        case "end":
          return _context3.stop();
      }
    }
  });
};

module.exports = {
  getHomeData: getHomeData,
  getMemorial_listData: getMemorial_listData,
  setHomeData: setHomeData
};