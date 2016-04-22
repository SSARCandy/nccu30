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
const speechlist = require('./data/speechlist.js');
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
    speechlist: speechlist,
    partialUrl: 'partial/' + tab + '.html'
  });
})

router.get('/speech/:speech/youtube', function*() {
  const template = fs.readFileSync(__dirname + '/views/index.html', 'utf-8');
  const imgs = getFileList(__dirname + config.galleryUrl + this.params.speech, this.params.speech);
  const covers = imgs.filter((img)=> { return img.indexOf('cover') !== -1; });
  const speechDetails = speechlist[parseInt(this.params.speech, 10) - 1];

  this.body = ejs.render(template, {
    covers: covers,
    filename: __dirname + '/views/index.html',
    speechDetails: speechDetails,
    tab: 'speech',
    partialUrl: 'partial/speechvediolist.html'
  });
});

router.get('/speech/:speech', function*() {
  const template = fs.readFileSync(__dirname + '/views/index.html', 'utf-8');
  const imgs = getFileList(__dirname + config.galleryUrl + this.params.speech, this.params.speech);
  console.log(this.params.speech, imgs);
  const covers = imgs.filter((img)=> { return img.indexOf('cover') !== -1; });
  const speechDetails = speechlist[parseInt(this.params.speech, 10) - 1];

  this.body = ejs.render(template, {
    img: imgs,
    covers: covers,
    filename: __dirname + '/views/index.html',
    speechDetails: speechDetails,
    tab: 'speech',
    partialUrl: 'partial/speech.html'
  });
});

app.use(router.routes());
app.use(require('koa-static')(__dirname + '/static'));

app.listen(process.env.PORT || 3210, function() {
  console.log('Server start on Port: ' + (process.env.PORT || 3210));
});

function getFileList(dir, num) {
  var results = [];

  fs.readdirSync(dir).forEach(function(file) {
    results.push(`/images/gallery/${num}/${file}`);
  });
  return results;
}
