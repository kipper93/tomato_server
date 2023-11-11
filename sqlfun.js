//sql语句 优化
var sqlMap = {
  user: {
      search: 'select * from tomato_home',
      add: 'insert into tomato_home (name,mark) values (?,?)'
  }
}
module.exports = sqlMap;