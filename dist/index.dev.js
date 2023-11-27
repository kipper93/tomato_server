"use strict";

// /*
// * version:1.0
// * date:2023:03:31
// * desc:微信小程序服务器
// * */
// mysql
// 新增
var express = require("express");

var cors = require("cors");

var mysql = require("mysql");

var serve = express();

var multer = require('multer'); //multer - node.js 中间件，用于处理 enctype="multipart/form-data"（设置表单的MIME编码）的表单数据。


var fs = require("fs");

var path = require('path');

serve.use(cors());
serve.use(express.json()); // 日志

var winston = require('winston');

var logger = winston.createLogger({
  level: 'info',
  format: winston.format.simple(),
  transports: [new winston.transports.File({
    filename: 'app.log'
  })]
});
var upload = multer({
  dest: './public/tmp/'
}); // 数据库

var db = mysql.createPool({
  host: "localhost",
  //新建数据库的host【默认值】
  user: "root",
  //新建数据库的user【默认值】
  password: "qweasdzxc123",
  //这儿还是上文说的那个密码
  database: "sys" //数据库名称【和navicat中的一一对应】

});
serve.use(express["static"]("./public")); // home-首页列表

serve.get("/home", function (req, res) {
  db.query("select * from tomato_home", function (err, result) {
    if (err) {
      console.log(err);
      res.send("访问数据错误");
    } else {
      res.send(JSON.stringify(result));
    }
  });
}); // home-新增首页列表

serve.post("/add_home", function (req, res) {
  var _req$body = req.body,
      name = _req$body.name,
      text = _req$body.text,
      url = _req$body.url,
      icon_state = _req$body.icon_state,
      title = _req$body.title,
      time = _req$body.time;
  db.query("INSERT INTO tomato_home (name,text,image_url,icon_state,title,date) VALUES ( '".concat(name, "','").concat(text, "','").concat(url, "',").concat(icon_state, ",'").concat(title, "','").concat(time, "' )"), function (err, result) {
    if (err) {
      console.log(err);
      res.send("访问数据错误");
    } else {
      res.send(JSON.stringify(result));
    }
  });
}); // 首页上传图片

serve.use('/uploadImg', upload.single('image'), function (req, res) {
  var file = req.file,
      body = req.body;

  if (file == undefined) {
    return res.json({
      code: 400,
      msg: '新增失败,参数缺失'
    });
  } else {
    logger.info(JSON.stringify(file));
    var fileInfo = {};
    var Year = new Date().getFullYear(); //年份

    var Month = new Date().getMonth(); //月份

    var Day = new Date().getDay(); //天

    var Hours = new Date().getHours(); //小时

    var Minutes = new Date().getMinutes(); //分钟

    var Seconds = new Date().getSeconds(); //秒数

    var Milliseconds = new Date().getMilliseconds(); //毫秒

    var time = "".concat(Year, "-").concat(Month, "-").concat(Day, "-").concat(Hours, "-").concat(Minutes, "-").concat(Seconds, "-").concat(Milliseconds);
    fs.renameSync('./public/tmp/' + file.filename, './public/tmp/' + time + '.' + file.mimetype.split('/')[1]); //可以根据喜爱命名方式，更改文件名称
    // 获取文件信息

    fileInfo.mimetype = file.mimetype;
    fileInfo.originalname = file.originalname;
    fileInfo.size = file.size; // fileInfo.path = file.path;

    fileInfo.path = '/tmp/' + time + '.' + file.mimetype.split('/')[1]; // 设置响应类型及编码

    res.set({
      'content-type': 'application/json; charset=utf-8'
    });
    res.json({
      data: fileInfo
    });
  }
}); // memorial-图片列表

serve.get("/memorial_list", function (req, res) {
  db.query("select * from tomato_memorial_url", function (err, result) {
    if (err) {
      console.log(err);
      res.send("访问数据错误");
    } else {
      res.send(JSON.stringify(result));
    }
  });
});
serve.listen(80, function () {
  console.log("服务器已启动");
});