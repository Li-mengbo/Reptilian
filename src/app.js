var config = require('./config.js');
var superagent = require('superagent');
var charset = require('superagent-charset');
charset(superagent);
const cheerio = require('cheerio');
var fs = require('fs')
var path = require('path');
var axios = require('axios');

var baseUrl = config.url; //输入任何网址都可以
var currentPageNum = 1;

var savePath = config.pathUrl;

if (!fs.existsSync(savePath)) {
    fs.mkdirSync(savePath)
    console.log(`主文件夹已生成：${savePath}`)
} else {
    console.log(`主文件夹已存在：${savePath}`)
}

// 判断相册是否存在
let folderPath = `${savePath}/${config.typeUrl}`
if (fs.existsSync(folderPath)) {
  console.log(`已存在：${config.typeUrl}`)
} else {
  fs.mkdirSync(folderPath)
  console.log(`已生成：${config.typeUrl}`)
}

const main = async page => {
    var route = `${config.route}/${ page }.html`
    //网页页面信息是gb2312，所以chaeset应该为.charset('gb2312')，一般网页则为utf-8,可以直接使用.charset('utf-8')
    superagent.get(baseUrl + route)
    .charset('UTF-8')
    .end(function(err, sres) {
        var items = [];
        if (err) {
            console.log('ERR: ' + err);
            return;
        }
        // 解析html
        var $ = cheerio.load(sres.text);
        $(config.dom).each(function(idx, element) {
            var $element = $(element);
            console.log('=>>>>>>>>>>>>>>>>>',  $element.find('img').attr('data-original'))
            var $subElement = $element.find('img');
            items.push({
                title: $(element).attr('title'),
                href: $element.attr('href'),
                thumbSrc: $subElement.attr('data-original')
            });
        });
        downloadAlbumList(items)
    });    
}

main(config.page)

// 下载本页面的所有相册
const downloadAlbumList = async (list) => {
    let index = 0
    for (let i = 0; i < list.length; i++) {
      // 下载相册
      await downloadAlbum(list[i])
      index++
    }
    // 判断本页相册是否下载完毕 
    if (index === list.length) {
      console.log(`第${currentPageNum}页下载完成，共${index}个相册。========================== `)
      if (currentPageNum < config.totalNo) {
        // 进行下一页的相册爬取
        main(++currentPageNum)
      }
    }
  }
  // 下载相册
const downloadAlbum = async album => {
    let type = album.thumbSrc.substr(-3)
    let name = Math.random().toString().slice(-6);
    console.log(`》》》 生成：${name}`)
    await downloadImage(album.thumbSrc, `${folderPath}/${name}.${type}`)
  }

const downloadImage =  async (imageSrc, fileName) => {
    await axios({
      method: 'get',
      url: imageSrc,
      responseType: 'stream'
    }).then(function(response) {
        // console.log('-------------------------',response.data)
        response.data.pipe(fs.createWriteStream(fileName))
    })
  }