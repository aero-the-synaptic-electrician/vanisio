const http=require("http"),https=require("https"),url=require("url"),fs=require("fs"),{extname:e}=require("path"),PORT=6969,kSiteUrl="vanis.io",kPreferJavascript=!0,isDirectory=t=>!e(t);http.createServer((t,s)=>{let r=url.parse(t.url),i="./dist"+r.pathname;console.log("Path",i);let n=e(i).slice(1);if("/initiate"===r.pathname&&"string"==typeof r.query){let a=r.query;if(!a.startsWith("http"))return s.statusCode=401,void s.end("Invalid backend usage");s.setHeader("location",a),s.setHeader("referrer","https://vanis.io")}if(!fs.existsSync(i))return s.statusCode=404,void s.end(`The requested file '${t.url}' doesn't exist`);if(isDirectory(i)&&!fs.existsSync(i))return s.statusCode=404,void s.end(`The requested directory '${t.url}' doesn't have a corresponding index file`);let o=new Map([["html","text/html"],["js","text/javascript"],["json","application/json"],["css","text/css"],["png","image/png"]]);try{let l=fs.readFileSync(i);s.setHeader("Access-Control-Allow-Origin","https://vanis.io"),s.setHeader("Access-Control-Allow-Credentials",!0),s.setHeader("Access-Control-Allow-Private-Network",!0),s.setHeader("Content-Type",o.has(n)?o.get(n):"text/plain"),s.end(l)}catch(d){return s.statusCode=500,void s.end(`The requested file '${i}' cannot be accessed`)}}).listen(6969),console.log("Server listening on port 6969");