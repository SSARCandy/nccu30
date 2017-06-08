'use strict'

require('babel-core/register');
const koa = require('koa');
const compress = require('koa-compress');
const app = koa();
const router = require('koa-router')();
const Promise = require('bluebird');
const _ = require('lodash');
const fs = require('fs');
const ejs = require('ejs');
const http = require('http');

const speechlist = require('./data/speechlist.js');
const newSpeech = require('./data/newestSpeech.js');
const config = require('./config/config.js');
const homelist = require('./data/home.js')


// logger
app.use(function*(next) {
  const start = new Date();
  yield next;
  const ms = new Date() - start;
  console.log('%s %s - %s ms', this.method, this.url, ms);
});

app.use(compress({
  threshold: 2048,
  flush: require('zlib').Z_SYNC_FLUSH
}));

router.get('/:tab', function*() {
  const template = fs.readFileSync(__dirname + '/views/index.html', 'utf-8');
  const tab = this.params.tab;
  var homeTube = [];
  var homeWallImg = [];
  var imgs = [];
  if (tab === 'home') {
    var range = [];
    for (var i = 0; i < 9; i++) {
      if (i === 8 || i === 6)
        continue;
      range.push(i);
    }
    shuffle(range);
    var randomNumber = range.slice(0, 2);
    for (var i = 0; i < 2; i++) {
      homeTube.push(homelist[randomNumber[i]].youtube);
    }

    for (var i = 1; i < 9; i++) {
      imgs = getFileList(__dirname + config.galleryUrl + i, i);
      homeWallImg = homeWallImg.concat(imgs);
    }
    shuffle(homeWallImg);
    homeWallImg = homeWallImg.slice(0, 20);
    homeWallImg = homeWallImg.filter((homeWallImg) => !~homeWallImg.indexOf('cover'));
  }

  this.body = ejs.render(template, {
    filename: __dirname + '/views/index.html',
    hideNewSpeech: config.hideNewSpeech,
    tab: tab,
    speechlist: speechlist,
    newSpeech: newSpeech,
    homelist: homelist,
    homeTube: homeTube,
    homeWallImg: homeWallImg,
    partialUrl: 'partial/' + tab + '.html'
  });
});

router.get('/speech/:speech/youtube', function*() {
  const template = fs.readFileSync(__dirname + '/views/index.html', 'utf-8');
  const imgs = getFileList(__dirname + config.galleryUrl + this.params.speech, this.params.speech);
  const covers = imgs.filter((img) => ~img.indexOf('cover'));
  const speechDetails = speechlist[parseInt(this.params.speech, 10) - 1];

  this.body = ejs.render(template, {
    hideNewSpeech: config.hideNewSpeech,
    covers: covers,
    filename: __dirname + '/views/index.html',
    newSpeech: null,
    speechDetails: speechDetails,
    tab: 'speech',
    partialUrl: 'partial/speechvideolist.html'
  });
});

router.get('/speech/:speech', function*() {
  var imgs = getFileList(__dirname + config.galleryUrl + this.params.speech, this.params.speech);
  const covers = imgs.filter((img) => ~img.indexOf('cover'));
  const template = fs.readFileSync(__dirname + '/views/index.html', 'utf-8');
  const speechDetails = speechlist[parseInt(this.params.speech, 10) - 1];

  imgs = imgs.filter((img) => !~img.indexOf('cover'));
  shuffle(imgs);

  this.body = ejs.render(template, {
    hideNewSpeech: config.hideNewSpeech,
    img: imgs,
    covers: covers,
    filename: __dirname + '/views/index.html',
    newSpeech: null,
    speechDetails: speechDetails,
    tab: 'speech',
    partialUrl: 'partial/speech.html'
  });
});


router.get('/', function*() {
  this.redirect('/home');
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

function shuffle(a) {
  var j, x, i;
  for (i = a.length; i; i -= 1) {
    j = Math.floor(Math.random() * i);
    x = a[i - 1];
    a[i - 1] = a[j];
    a[j] = x;
  }
}
