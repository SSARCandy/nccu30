'use strict'

require('babel-core/register')
const koa = require('koa')
const app = koa()
const router = require('koa-router')()
const Promise = require('bluebird')
const _ = require('lodash')
const fs = require('fs')
const ejs = require('ejs')
const http = require('http')
const config = require('./config.js');


// logger
app.use(function*(next) {
  const start = new Date();
  yield next;
  const ms = new Date() - start;
  console.log('%s %s - %s ms', this.method, this.url, ms);
});

router.get('/', function*() {
  this.redirect('/home');
});

router.get('/:tab', function*() {
  const template = fs.readFileSync(__dirname + '/views/index.html', 'utf-8');
  const tab = this.params.tab;
  this.body = ejs.render(template, {
    filename: __dirname + '/views/index.html',
    tab: tab,
    partialUrl: 'partial/' + tab + '.html'
  });
})

router.get('/speech/:speech', function*() {
  const template = fs.readFileSync(__dirname + '/views/index.html', 'utf-8');
  const imgs = getFileList(__dirname + config.galleryUrl + this.params.speech);
  this.body = ejs.render(template, {
    img: imgs,
    filename: __dirname + '/views/index.html',
    tab: 'speech',
    partialUrl: 'partial/speech.html'
  });
});

app.use(router.routes());
app.use(require('koa-static')(__dirname + '/static'));

app.listen(process.env.PORT || 3020, function() {
  console.log('Server start on Port: ' + (process.env.PORT || 3020));
});

function getFileList(dir) {
  var results = [];

  fs.readdirSync(dir).forEach(function(file) {
    results.push('/images/gallery/1/' + file);
  });
  return results;
}
