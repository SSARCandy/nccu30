'use strict'

require('babel-core/register')
const koa     = require('koa')
const app     = koa()
const router  = require('koa-router')()
const Promise = require('bluebird')
const _       = require('lodash')
const fs      = require('fs')
const ejs     = require('ejs')
const http    = require('http')


// logger
app.use(function*(next) {
  const start = new Date();
  yield next;
  const ms = new Date() - start;
  console.log('%s %s - %s ms', this.method, this.url, ms);
});

router.get('/', function*() {
  const template = fs.readFileSync(__dirname + '/views/index.html', 'utf-8');
  this.body = ejs.render(template);
});

app.use(router.routes());
app.use(require('koa-static')(__dirname + '/static'));

app.listen(process.env.PORT || 3020, function() {
  console.log('Server start on Port: ' + (process.env.PORT || 3020));
});
