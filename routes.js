const Router = require('koa-router')   //路由模块
const router = new Router()

router.get('/index', async (context, next) => {
    context.body = {
        data: { get: 1 },
        status: 0
    }
})

module.exports = router