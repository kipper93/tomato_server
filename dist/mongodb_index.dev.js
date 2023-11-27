"use strict";

/*
 mongodb express.js: 引入 express 模块，设置路由
*/
var express = require('express')();

var multer = require('multer'); //multer - node.js 中间件，用于处理 


var fs = require("fs");

var expe = require("express");

express.use(expe.json());
express.use(expe["static"]("./public"));
var upload = multer({
  dest: './public/tmp/'
});
express.get('/', function (request, response) {
  // 路由
  response.send("hello world!"); // 传送HTTP响应
});
express.listen(443, function () {
  console.log("服务器已启动,端口 443");
}); //监听 8000端口，默认localhost: 127.0.0.1 || 0.0.0.0

/*
  express.js: 使用 mongoose 建立接口，添加数据到 MongoDB
 */

var mongodb = require("./model/mongoose"); // 首页列表


express.get("/home", function (req, res) {
  mongodb.getHomeData().then(function (result) {
    res.end(JSON.stringify(result));
  });
}); // 照片墙

express.get("/memorial_list", function (req, res) {
  mongodb.getMemorial_listData().then(function (result) {
    res.end(JSON.stringify(result));
  });
}); // 上传home图片

express.use('/uploadImg', upload.single('image'), function (req, res) {
  var file = req.file,
      body = req.body;

  if (file == undefined) {
    return res.json({
      code: 400,
      msg: '新增失败,参数缺失'
    });
  } else {
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
}); // 新增home

express.post("/add_home", function (req, res) {
  var _req$body = req.body,
      name = _req$body.name,
      text = _req$body.text,
      url = _req$body.url,
      icon_state = _req$body.icon_state,
      title = _req$body.title,
      time = _req$body.time,
      avatarUrl = _req$body.avatarUrl;
  var data = {
    name: name,
    text: text,
    image_url: url,
    icon_state: icon_state,
    title: title,
    date: time,
    avatarUrl: avatarUrl
  };
  mongodb.setHomeData(data).then(function (result) {
    res.end("success");
  });
});