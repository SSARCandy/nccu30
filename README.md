# 政大三十大講堂

### Require

- node v4
- bower

### How to run

```
~$ npm install -g nodemon
~$ npm install
~$ bower install
~$ npm run dev
```

app will listen at `localhost:3210`

### Images

all images put in `static/`, thumbnails put in `static/thumbnails/`, you can use [QuickThumb](https://github.com/zivester/node-quickthumb) to generate thumbnails.

```
node node_modules/quickthumb/bin/make-thumb.js static/images/gallery/8 static/thumbnails/images/gallery/8 200x200 -r --resize
```

### Code style

Use **2 space** for indention

