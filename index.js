// /*
// * version:1.0
// * date:2023:03:31
// * desc:微信小程序服务器
// * */

// 新增

const express = require("express");

const cors = require("cors");

const mysql = require("mysql");

const serve = express();

var multer = require('multer'); //multer - node.js 中间件，用于处理 enctype="multipart/form-data"（设置表单的MIME编码）的表单数据。

const fs = require("fs");

var path = require('path')

serve.use(cors());
serve.use(express.json());



// 日志
const winston = require('winston'); 
const logger = winston.createLogger({   
  level: 'info',   
  format: winston.format.simple(),   
  transports: [
    new winston.transports.File({ filename: 'app.log' })
  ] 
}); 


const upload = multer({ dest: './public/tmp/' })

// 数据库
const db = mysql.createPool({
  host: "localhost",     //新建数据库的host【默认值】
  user: "root",         //新建数据库的user【默认值】
  password: "qweasdzxc123",    //这儿还是上文说的那个密码
  database: "sys",      //数据库名称【和navicat中的一一对应】
});

serve.use(express.static("./public"));


// home-首页列表
serve.get("/home", (req, res) => {
  db.query("select * from tomato_home", (err, result) => {
    if (err) {
      console.log(err);
      res.send("访问数据错误");
    } else {
      res.send(JSON.stringify(result));
    }
  });
});


// home-新增首页列表
serve.post("/add_home", (req, res) => {
  const { name, text, url, icon_state, title , time} = req.body
  db.query(`INSERT INTO tomato_home (name,text,image_url,icon_state,title,date) VALUES ( '${name}','${text}','${url}',${icon_state},'${title}','${time}' )`, (err, result) => {
    if (err) {
      console.log(err);
      res.send("访问数据错误");
    } else {
      res.send(JSON.stringify(result));
    }
  });
});

// 首页上传图片
serve.use('/uploadImg', upload.single('image'), (req, res) => {

  const {file,body} = req  

  if( file == undefined){
    return res.json({code:400,msg:'新增失败,参数缺失'})
  } else{
    logger.info(JSON.stringify(file))
    let fileInfo = {};
    
    
    let Year=new Date().getFullYear();  //年份
    let Month=new Date().getMonth();  //月份
    let Day=new Date().getDay();  //天
    let Hours=new Date().getHours();  //小时
    let Minutes=new Date().getMinutes();  //分钟
    let Seconds=new Date().getSeconds();   //秒数
    let Milliseconds=new Date().getMilliseconds();//毫秒
    let time=`${Year}-${Month}-${Day}-${Hours}-${Minutes}-${Seconds}-${Milliseconds}`;
 
    fs.renameSync('./public/tmp/' + file.filename, './public/tmp/' + time+'.' + file.mimetype.split('/')[1]);  //可以根据喜爱命名方式，更改文件名称
    // 获取文件信息
    fileInfo.mimetype = file.mimetype;
    fileInfo.originalname = file.originalname;
    fileInfo.size = file.size;
    // fileInfo.path = file.path;
    fileInfo.path = '/tmp/' + time +'.' + file.mimetype.split('/')[1];
 
    // 设置响应类型及编码
    res.set({
      'content-type': 'application/json; charset=utf-8'
    });
 
    res.json({
      data:fileInfo
    });
  } 
  
  })




// memorial-图片列表
serve.get("/memorial_list", (req, res) => {
  db.query("select * from tomato_memorial_url", (err, result) => {
    if (err) {
      console.log(err);
      res.send("访问数据错误");
    } else {
      res.send(JSON.stringify(result));
    }
  });
});



serve.listen(8000, () => {
  console.log("服务器已启动");
});