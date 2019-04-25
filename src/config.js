/*
* url 抓取域名
* route 抓取地址 
* page 抓取图片开始页码
* dom 图片dom元素
* pathUrl 生成目录地址
* typeUrl 抓取图片分类
* totalNo 抓取总页码
*
*/
module.exports = {
  url: 'https://fabiaoqing.com/',
  route: 'biaoqing/lists/page/',
  page: '1',
  dom: 'div#container div.tagbqppdiv a',
  pathUrl: 'D:/表情1',
  typeUrl: '热门',
  totalNo: '30'
}