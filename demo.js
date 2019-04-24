var superagent = require('superagent');
var charset = require('superagent-charset');
charset(superagent);
var express = require('express');
var baseUrl = 'https://fabiaoqing.com/'; //输入任何网址都可以
const cheerio = require('cheerio');
var fs = require('fs')
var path = require('path')

var app = express();
app.use(express.static('static'))
app.get('/index', function(req, res) {
    //设置请求头
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    //类型
    console.log(req.query)
    var type = req.query.type;
    //页码
    var page = req.query.page;
    type = type || 'weixin';
    page = page || '1';
    var route = `bqb/detail/id/30562.html`
        //网页页面信息是gb2312，所以chaeset应该为.charset('gb2312')，一般网页则为utf-8,可以直接使用.charset('utf-8')
        console.log(baseUrl + route)
    superagent.get(baseUrl + route)
        .charset('UTF-8')
        .end(function(err, sres) {
            var items = [];
            if (err) {
                console.log('ERR: ' + err);
                res.json({ code: 400, msg: err, sets: items });
                return;
            }
            // 解析html
            var $ = cheerio.load(sres.text);
            $('div.image div.swiper-wrapper .swiper-slide a').each(function(idx, element) {
                var $element = $(element);
                var $subElement = $element.find('img');
                items.push({
                    title: $(element).attr('title'),
                    href: $element.attr('href'),
                    thumbSrc: $subElement.attr('data-original')
                });
            });
            // fs.access(path.join(__dirname, '/img.json'), fs.constants.F_OK, err => {
            //     if (err) { // 文件不存在
            //         fs.writeFile(path.join(__dirname,'/img.json'), JSON.stringify([
            //             {
            //                 route,
            //                 items
            //             }
            //         ]), err => {
            //             if(err) {
            //                 console.log(err)
            //                 return false
            //             }
            //             console.log('保存成功')
            //         })
            //     } else {
            //         fs.readFile(path.join(__dirname, '/img.json'), (err, data) => {
            //             if (err) {
            //                 console.log(err)
            //                 return false
            //             }
            //             data = JSON.parse(data.toString())
            //             let exist = data.some((page, index) => {
            //                 return page.route == route
            //             })
            //             if (!exist) {
            //                 fs.writeFile(path.join(__dirname, 'img.json'), JSON.stringify([
            //                     ...data,
            //                     {
            //                         route,
            //                         items
            //                     },
            //                 ]), err => {
            //                     if (err) {
            //                         console.log(err)
            //                         return false
            //                     }
            //                 })
            //             }
            //         })
            //     }
            // })
            // res.json({ code: 200, msg: "", items });
            // console.log(items)
        });
});
var server = app.listen(8081, function() {

    var host = server.address().address
    var port = server.address().port

    console.log("应用实例，访问地址为 http://%s:%s", host, port)

})