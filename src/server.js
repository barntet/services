const express = require("express");
const { resolve } = require("path");
const { promisify } = require("util");
const initMiddlewares = require('./middlewares');
const initControllers = require("./controllers");
const { nextTick } = require("process");

const server = express();
const port = parseInt(process.env.PORT || "9000");
const pubilcDir = resolve("public");
const mouldsDir = resolve('src/moulds');

async function bootstrap() {
  server.use(express.static(pubilcDir));
  server.use('/moulds', express.static(mouldsDir))
  server.use(await initMiddlewares());
  server.use(await initControllers());
  server.use(errorHandler);
  await promisify(server.listen.bind(server, port))();
  console.log(`> Started on port ${port}`);
}


// 监听未捕获的 Promise 异常，
// 直接退出进程
process.on('unhandledRejection', error => {
  console.error(error);
  process.exit(1);
});


function errorHandler(err, req, res, next) {
  if (res.headerSent) {
    // 如果返回响应结果时发生异常
    // 那么交给express内置的finalhadler 关闭连接
    return next(err);
  }
  // 打印异常
  console.log(err);
  // 重定向到异常指定页面
  res.redirect('/500.html');
}

bootstrap();
