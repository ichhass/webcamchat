// http://xakep.ru/web-rtc/

var koa = require('koa');
var router = require('koa-router');
var serve = require('koa-static');
var logger = require('koa-logger');
var views = require('koa-views');

var app = koa();

app.use(logger());

app.use(function* (next) {
	yield* next;
});

app.use(serve('public'));

app.use(views('views', {
	default: 'jade'
}));

app.use(router(app));

app.get('/', function* () {
	yield this.render('index');
});

app.listen(3000);