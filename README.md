# gulp-browsersync-php-template
Based on [iceener/gulp-browsersync-project-starter](https://github.com/iceener/gulp-browsersync-project-starter) but adapted to support php, and with boilerplate structure for SASS

## How to use
You need to have a php server avalible in your command line, and then run
```
npm i
```

To run develop server execute
```
npm run serve
```

To build SASS and Babel JS
```
npm run build
```

To watch files
```
npm run watch
```

## Using the Apache server
If you want to use apache server (or any other server) instead of the clear php server, you can achive this by changing `devServer` function to following form:
```js
browserSync
  .get('devServer')  
  .init({
    proxy: '$server_address',
    baseDir: "./dist",
    open:true,
    notify:false
  });
```
where `$server_address` is addres where your server is running. Then running `npm run serve` command will proxy the server, so BrowserSync will be still working.