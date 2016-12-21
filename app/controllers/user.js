var User = require('../modules/user')
	//signup注册
	//show signup路由
exports.showSignup = function(req, res) {
	res.render('signup', {
		title: '注册页面'

	})
}
exports.showSignin = function(req, res) {
	res.render('signin', {
		title: '登录页面'


	})
}

exports.signup = function(req, res) {
	var _user = req.body.user
	console.log('---------')
	console.log(_user)
	User.findOne({
		name: _user.name
	}, function(err, user) {
		if (err) {
			console.log(err)
		}
		if (user) {
			return res.redirect('/signin')
		} else {
			user = new User(_user)
			console.log(user)
			console.log('================')
			user.save(function(err, user) {
				if (err) {
					console.log(err)
				}
				res.redirect('/')
			})

		}
	})


}



//signin 登录
exports.signin = function(req, res) {
	var _user = req.body.user
	var name = _user.name
	var password = _user.password


	User.findOne({
		name: name
	}, function(err, user) {
		console.log(user + '--------')
		if (err) {
			console.log(err)
		}
		if (!user) {
			return res.redirect('/signup')
		}

		user.comparePassword(password, function(err, isMatch) {
			if (err) {
				console.log(err)
			}

			if (isMatch) {
				req.session.user = user
				console.log('密码正确')
				return res.redirect('/')
			} else {
				return res.redirect('/signin')
				console.log('密码错误')
			}
		})
	})
}


//logout
exports.logout = function(req, res) {
	delete req.session.user
		//delete app.locals.user   app 在app.js和routes.js里可以访问在这里不能访问了

	res.redirect('/')
}


//user list page路由
exports.list = function(req, res) {
	console.log('list')
	User.fetch(function(err, users) {
		if (err) {
			console.log(err)
		}
		res.render('userlist', {
			title: '用户列表',
			users: users

		})

	})
}

//midware for user
exports.signinRequired = function(req, res, next) {
	var user = req.session.user;
	if (!user) {
		return res.redirect('/signin')
	}
	next()
}

exports.adminRequired = function(req, res, next) {
	var user = req.session.user;
	if (user.role <= 10) {
		return res.redirect('/signin')
	}
	next()
}