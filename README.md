### 这是什么?
这是一个高性能的基于`puppeteer`的`SSR`方案, 他使用Headless Chrome从网页中生成html,然后以http的方法返回html内容

## 使用
```js
git clone  
cd sparender
npm i
npm start
```

## 查看效果
```js
http://127.0.0.1:3001?url=http://www.example.com
```

### 功能
 * puppeteer连接池
 * render并发限制
 * log4j 日志
 * 已集成任务调度
 * 生产，开发环境配置
 * redis缓存
