const http = require('http')
const fs = require('fs')
const port = 80;
const _404pngdata = fs.readFileSync('./img/404.PNG')

const server = http.createServer((req,res)=>{

    const url = req.url;
    const url_arr = req.url.split('/')
    console.log('[url]',url)

    function _404(res, url, err){
        //console.error('_404 fn err', url, err)
        res.writeHead(404, {'Content-Type':'text/html; charset=utf-8'});
        res.end('404 Page Not Found');
    }

    function fs_readfile(res, url, encode, file_type, callback){
        //console.log('fs_readfile', url)
        var name = url.split('/').reverse()[0]
        var url_arr = url.split('/');
        if ( name.includes('.html')) file_type='text/html; charset=utf-8';
        if ( name.includes('.css')) file_type='text/css; charset=utf-8';
        
        fs.readFile(url, encode, (err,data)=>{
            if(err){ 
                console.error('[error] fs_readfile', err, url, encode, file_type)
                res.writeHead(404, {'Content-Type':'text/html; charset=utf-8'});
                res.end('Page Not Found');
            }else{
                res.writeHead(200, {'Content-Type':file_type});
                res.end(data)
            }
        })
    callback();
    }

    if(url=='/') fs_readfile(res,'asset/index.html', 'utf8', 'text/html; charset=utf-8', ()=>{})
    else if(url=='/main.css') fs_readfile(res,'asset/main.css', 'utf8', 'text/css; charset=utf-8', ()=>{})
    else if(url=='/map.js') fs_readfile(res,'asset/map.js', 'utf8', 'text/javascript; charset=utf-8', ()=>{})
    else if(url=='/favicon.ico') fs_readfile(res,'asset/favicon.ico', null, 'image/x-icon', ()=>{})
    else if(url_arr[1]=='img' && url_arr[2]=='map'){
        var file_path = 'img/map/'+url_arr.slice(3).join('/')//+'.PNG';
        //console.log('[mapimg]', file_path);
        
        fs.readFile(file_path, null, (err,data)=>{
            if(err){ 
                res.writeHead(200, {'Content-Type':'image/png'});
                res.end(_404pngdata)
                //_404(res,url, 'internet error, img can not down');
            }else{
                res.end(data)
            }
        })

    }
    else _404(res,url, 'Page Not Found, else;');
})

server.listen(port,()=>{console.log(`Server is running at localhost:${port}`)})