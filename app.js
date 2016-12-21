var express = require('express');
var app = express();
var path = require('path')
var mongoose = require('mongoose')
var logger = require('morgan')
var fs = require('fs')


// models loading
var models_path = __dirname + '/app/modules'
var walk = function(path) {
	fs
		.readdirSync(path)
		.forEach(function(file) {
			var newPath = path + '/' + file
			var stat = fs.statSync(newPath)

			if (stat.isFile()) {
				if (/(.*)\.(js|coffee)/.test(file)) {
					require(newPath)
				}
			} else if (stat.isDirectory()) {
				walk(newPath)
			}
		})
}

walk(models_path)

var bodyParser = require('body-parser')
	//var multer = require('multer') //处理上传文件的
var session = require('express-session')
var cookieParser = require('cookie-parser')
var mongoStore = require('connect-mongo')(session)
var port = process.env.PORT || 3000; //在命令行中设置端口或者选用默认3000

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/imooc')


app.set('views', './app/views/pages'); //设置视图的根目录
app.set('view engine', 'jade') //设置默认的模版引擎
app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.urlencoded({
	extended: true
}))
app.use(cookieParser())
	//app.use(multer())
app.use(session({
	secret: 'imooc',
	store: new mongoStore({
		url: 'mongodb://localhost/imooc',
		collection: 'sessions'

	})
}))

if ('development' === app.get('env')) {
	app.set('showStackError', true)
	app.use(logger(':method :url :status'))
	app.locals.pretty = true
	mongoose.set('debug', true)
}
require('./config/routes.js')(app)

app.listen(port);
app.locals.moment = require('moment')
console.log('开始监听幕客端口' + port)