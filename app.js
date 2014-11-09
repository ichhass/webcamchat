var koa = require('koa');
var router = require('koa-router');
var serve = require('koa-static');
var logger = require('koa-logger');

var app = koa();

app.use(logger());

app.use(function* (next) {
	yield* next;
});

app.use(serve('public'));

app.use(router(app));

app.get('/', function* () {
	this.body = 'hello, world';
})

app.listen(3000);