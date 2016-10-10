 ![image](https://github.com/WayneLiang/crawler-lagou/blob/master/public/images/node_city.jpeg)
 ![image](https://github.com/WayneLiang/crawler-lagou/blob/master/public/images/node_salary.jpeg)
 ![image](https://github.com/WayneLiang/crawler-lagou/blob/master/public/images/node_workyear.jpeg)
 

## 所需环境
1. node环境
2. MongoDB

## 使用步骤
### 1. Clone
```
git clone git@github.com:WayneLiang/crawler-lagou.git
```
### 2. 还原第三方包
```
cd crawler-lagou
npm install 
```
### 3. 抓取ip
```
node getIp.js 
```
### 4. 抓取职位信息
```
node getLagouData.js
```
### 5. 显示抓取完成后启动Web页面
```
node  bin\run
```
### 6. 浏览器访问 http://localhost:3000/