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
const homelist = require('./data/home.js');
const config = require('./config/config.js');


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

router.get('/home', function* () {
  const template = fs.readFileSync(__dirname + '/views/index.html', 'utf-8');
  const coverPhotos = fs.readdirSync(__dirname + config.homeimgUrl).map(f => `/images/home/${f}`).filter((f) => ~f.indexOf('slide'));
  let homeTube = _.flatten(speechlist.map((s) => s.details.youtube));
  let homeWallImg = _.flatten(speechlist.map((_, idx) => getFileList(`${__dirname}${config.galleryUrl}${idx+1}`, idx+1)));
  
  shuffle(homeWallImg);
  shuffle(homeTube);

  homelist.forEach((item, i)=>{
    item.image = coverPhotos[i];
  });

  this.body = ejs.render(template, {
    filename: __dirname + '/views/index.html',
    hideNewSpeech: config.hideNewSpeech,
    tab: 'home',
    newSpeech: newSpeech,
    homelist: homelist,
    homeTube: homeTube.slice(0, 2),
    homeWallImg: homeWallImg.filter((f) => !~f.indexOf('cover')).slice(0, 30),
    partialUrl: 'partial/home.html'
  });
});

router.get('/:tab', function*() {
  const template = fs.readFileSync(__dirname + '/views/index.html', 'utf-8');
  const tab = this.params.tab;

  this.body = ejs.render(template, {
    filename: __dirname + '/views/index.html',
    hideNewSpeech: config.hideNewSpeech,
    tab: tab,
    speechlist: speechlist,
    newSpeech: newSpeech,
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
    tab: 'live',
    partialUrl: 'partial/speechvideolist.html'
  });
});

router.get('/speech/:speech', function*() {
  let imgs = getFileList(__dirname + config.galleryUrl + this.params.speech, this.params.speech);
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
  let results = [];

  fs.readdirSync(dir).forEach(function(file) {
    results.push(`/images/gallery/${num}/${file}`);
  });
  return results;
}

function shuffle(a) {
  let j, x, i;
  for (i = a.length; i; i -= 1) {
    j = Math.floor(Math.random() * i);
    x = a[i - 1];
    a[i - 1] = a[j];
    a[j] = x;
  }
}
