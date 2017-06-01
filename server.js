var http = require("http"), // 引入http核心模块
	fs = require("fs"), // 引入文件系统
	url = require("url"); // 引入url模块
var mongodb=require("mongodb")

function Server() {}

Object.assign(Server.prototype, {

	createServer: function(){
		var server = http.createServer(function(request, response) {

			var queryUrl = request.url, // 拿到url信息
				urlInfo = url.parse(queryUrl, true), //信息对象
				path = urlInfo.pathname, //解析url获取路径信息 ／
				params = urlInfo.query;  // 解析rul获取请求参数

			if (path == "/") { // 根据不同的路径显示不同内容
				var fileContent = fs.readFileSync("index.html") + '';
				

				var client = mongodb.MongoClient;

				client.connect("mongodb://127.0.0.1:27017/limenghua", function(err, db){
					var collection = db.collection("class");
					collection.find({}).toArray(function(err, result){
						console.log(result);
						db.close();
						var str="";
						str+="<table border=1>"
						str+="<tr>"
						for (var k in result[0]) {
							str+="<th>"+k+"</th>"
						}
						str+="</tr>"
						for (var i in result) {
							str+="<tr>"
							for(var j in result[i]){
							str+="<td>"+result[i][j]+"</td>"	
							}
							str+="</tr>"
						}
						str+="</table>"
						fileContent = fileContent.replace("{{name}}",str);
						response.setHeader("200", {
							"Content-Type" : "text/html;chartset=utf-8"
						})
						response.end(fileContent);
					})
				})
				
			}else if(path == "/img"){ //显示图片内容
				var fileContent = fs.readFileSync("timg.jpeg","binary"); // 二进制读取图片内容
				response.setHeader("200", {
					"Content-Type" : "image/jpeg"
				})
				response.end(fileContent,"binary");
			}else { //显示404页面
				var fileContent = fs.readFileSync("404.html");
				response.setHeader("200", {
					"Content-Type" : "text/html;chartset=utf-8"
				})
				response.end(fileContent);
			}			

		});

		server.listen("8881", "127.0.0.1");
	}
})


var instance = new Server();
instance.createServer();