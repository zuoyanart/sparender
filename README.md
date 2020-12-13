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
  

### 渲染方式对比

一下内容摘自 <a href="https://markdowner.net/article/73058307795021824" target="_blank">https://markdowner.net/article/73058307795021824</a>, 并根据自己经验做了部分改动
<table>
  <tr>
  <td>方式</td>
  <td>优点</td>
  <td>缺点</td>
  </tr>
  <tr>
  <td>CSR 客户端渲染</td>
  <td>SPA 的优点（用户体验较好）</td>
  <td> * SEO不友好（爬虫如果没有执行js的能力，如百度，获取到的页面是空的，不利于网站推广）<br>
 首屏加载慢（到达浏览器端后再加载数据，增加用户等待时间</td>
  </tr>
  <tr>
  <td>SSR 服务端渲染</td>
  <td>SEO 友好, 首屏渲染快（可在服务端缓存页面，请求到来直接给 html）</td>
  <td> 代码改动大、需要做特定SSR框架的改动（经过我们实践、原有SPA代码改动非常大）<br><br>丢失了部分SPA体验<br><br>node 容易成为性能瓶颈</td>
  </tr>
    <tr>
  <td>服务端动态渲染（利用user-agent）</td>
  <td>兼顾 SPA优点同时解决SEO问题</td>
  <td>需要服务端应用（但动态渲染只针对爬虫、不会成为性能瓶颈）</td>
  </tr>
</table>

#### 服务端动态渲染（利用user-agent）

为了提高用户体验我们用了SPA技术、为了SEO 我们用了 SSR、预渲染等技术。不同技术方案有一定差距，不能兼顾优点。但仔细想，需要这些技术优点的`用户`，其实时不一样的，SPA 针对的是浏览器普通用户、SSR 针对的是网页爬虫，如 googlebot、baiduspider 等，那为什么我们不能给不同`用户`不同的页面呢，服务端动态渲染就是这种方案。

基本原理： 服务端对请求的 user-agent 进行判断，浏览器端直接给 SPA 页面，如果是爬虫，给经过动态渲染的 html 页面(因为蜘蛛不会造成DDOS,所以这种方案相对于SSR能节省不少服务器资源)

PS： 你可能会问，给了爬虫不同的页面，会不会被认为是网页作弊行为呢？
Google 给了<a href="https://developers.google.com/search/docs/guides/dynamic-rendering" target="_blank">回复</a>：

Dynamic rendering is not cloaking
Googlebot generally doesn't consider dynamic rendering as cloaking. As long as your dynamic rendering produces similar content, Googlebot won't view dynamic rendering as cloaking.
When you're setting up dynamic rendering, your site may produce error pages. Googlebot doesn't consider these error pages as cloaking and treats the error as any other error page.
Using dynamic rendering to serve completely different content to users and crawlers can be considered cloaking. For example, a website that serves a page about cats to users and a page about dogs to crawlers can be considered cloaking.

也就是说，如果我们没有刻意去作弊，而是使用动态渲染方案去解决SEO问题，爬虫经过对比网站内容，没有明显差异，不会认为这是作弊行为。

至于百度,请参考
<a href="https://www.zhihu.com/question/19864108" target="_blank">豆丁网是在做黑帽 SEO 吗？</a>
<a href="https://ask.seowhy.com/question/16688" target="_blank">通过user-agent判断，将Baiduspider定向到http页面</a>

基本的解释是:
>
>的确从单一feature来讲，会比较难区分cloaking型的spam和豆丁类的搜索优化，但是搜索引擎判断spam绝对不会只用一个维度的feature。docin这样的网站，依靠它的外链关系、alexa流量、用户在搜索结果里面的点击行为等等众多信号，都足以将其从spam里面拯救出来了。
>
> 何况，一般的spam肯定还有关键词堆砌、文本语义前后不搭、link farm等等众多特征。总之antispam一门综合性的算法，会参考很多要素，最后给出判断。
>
> 实在不行了，还可以有白名单作为最后的弥补手段，拯救这批大网站是没什么问题的啦。

所以不做过多的黑帽或者灰帽, 百度也不会做作弊处理
