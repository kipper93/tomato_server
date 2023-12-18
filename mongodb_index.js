/*
 mongodb express.js: 引入 express 模块，设置路由
*/
var express = require('express')()
var multer = require('multer'); //multer - node.js 中间件，用于处理 
const fs = require("fs");

const expe = require("express");

express.use(expe.json());

express.use(expe.static("./public"));

const upload = multer({ dest: './public/tmp/' })



express.get('/', function (request, response) { // 路由
  response.send("hello world!") // 传送HTTP响应
})


express.listen(8000, () => {
  console.log("服务器已启动,端口号 8000");
});

//监听80端口，默认localhost: 127.0.0.1 || 0.0.0.0

/*
  express.js: 使用 mongoose 建立接口，添加数据到 MongoDB
 */
const mongodb = require("./model/mongoose")

// 首页列表
express.get("/home", function (req, res) {
  mongodb.getHomeData().then((result) => {
    res.end(JSON.stringify(result));
  });
})

// 照片墙
express.get("/memorial_list", function (req, res) {
  mongodb.getMemorial_listData().then((result) => {
    res.end(JSON.stringify(result));
  });
})


// 上传home图片

express.use('/uploadImg', upload.single('image'), (req, res) => {

  const { file, body } = req

  if (file == undefined) {
    return res.json({ code: 400, msg: '新增失败,参数缺失' })
  } else {
    let fileInfo = {};
    let Year = new Date().getFullYear();  //年份
    let Month = new Date().getMonth();  //月份
    let Day = new Date().getDay();  //天
    let Hours = new Date().getHours();  //小时
    let Minutes = new Date().getMinutes();  //分钟
    let Seconds = new Date().getSeconds();   //秒数
    let Milliseconds = new Date().getMilliseconds();//毫秒
    let time = `${Year}-${Month}-${Day}-${Hours}-${Minutes}-${Seconds}-${Milliseconds}`;

    fs.renameSync('./public/tmp/' + file.filename, './public/tmp/' + time + '.' + file.mimetype.split('/')[1]);  //可以根据喜爱命名方式，更改文件名称
    // 获取文件信息
    fileInfo.mimetype = file.mimetype;
    fileInfo.originalname = file.originalname;
    fileInfo.size = file.size;
    // fileInfo.path = file.path;
    fileInfo.path = '/tmp/' + time + '.' + file.mimetype.split('/')[1];

    // 设置响应类型及编码
    res.set({
      'content-type': 'application/json; charset=utf-8'
    });

    res.json({
      data: fileInfo
    });
  }

})


// 新增home
express.post("/add_home", (req, res) => {
  const { name, text, url, icon_state, title, time ,avatarUrl} = req.body
  let data = {
    name,
    text,
    image_url: url,
    icon_state,
    title,
    date: time,
    avatarUrl
  }
    mongodb.setHomeData(data).then((result) => {
      res.end("success");
  });
});


// 背影
express.get("/back_list", function (req, res) {
  mongodb.getBackData().then((result) => {
    res.end(JSON.stringify(result));
  });
})

