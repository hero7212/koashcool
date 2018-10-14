// 导入koa，和koa 1.x不同，在koa2中，我们导入的是一个class，因此用大写的Koa表示:
const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const Monk = require('monk');
// 创建一个Koa对象表示web app本身:
const app = new Koa();
const router=new Router();
const db=new Monk('localhost/school');//链接到库
const school = db.get('school');//表

app.use(bodyParser());
// 打印request URL:
app.use(async (ctx, next) => {
		console.log(`Process ${ctx.request.method} ${ctx.request.url}...`);
    await next();
});


// 对于任何请求，app将调用该异步函数处理请求：
router.get('/', async ( ctx ) => {
  ctx.response.type = 'text/html';
  ctx.body = 'hi'
})
router.get('/getList', async ( ctx ) => {
  let st = ctx.query.name ? await school.find({name:ctx.query.name}) : await school.find();
  ctx.response.type = 'application/json';
  ctx.body = st;
})
router.post('/toInsert', async ( ctx ) => {
	await school.insert(ctx.request.body)
  ctx.body = {
		code: 0,
		msg: '新增成功'
	}
})
router.post('/toUpdate', async ( ctx ) => {	
	let {_id,...body} = ctx.request.body
	await school.update({_id},body)
  ctx.body = {
		code: 0,
		msg: '修改成功'
	}
})
router.post('/toDelete', async ( ctx ) => {	
	let {_id} = ctx.request.body
	await school.remove({_id})
  ctx.body = {
		code: 0,
		msg: '删除成功'
	}
})


// 加载路由中间件
//解释：app.use 加载用于处理http請求的middleware（中间件），当一个请求来的时候，会依次被这些 middlewares处理。
app.use(router.routes());

// 在端口3000监听:
app.listen(3000, () => {
  console.log('[myapp]已经运行，端口为3000')
})