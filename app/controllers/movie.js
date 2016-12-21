var _ = require('underscore')
var Movie = require('../modules/movie')
var Comment = require('../modules/comment')
var Category = require('../modules/category')
var fs = require('fs')
var path = require('path')

//detail page路由
exports.detail = function(req, res) {
	var id = req.params.id
	console.log('打印param＝＝＝＝')
	console.log(req.params)
	console.log('打印id＝＝＝＝')
	console.log(id)
	Movie.update({
		_id: id
	}, {
		$inc: {
			pv: 1
		}
	}, function(err) {
		if (err) {
			console.log(err)
		}
	})
	Movie.findById(id, function(err, movie) {
		Comment
			.find({
				movie: id
			})
			.populate('from', 'name')
			.populate('reply.from reply.to', 'name')
			.exec(function(err, comments) {
				console.log('打印comments＝＝＝＝')
				console.log(comments)
				res.render('detail', {
					title: '详情页',
					movie: movie,
					comments: comments
				})
			})
	})
}



//admin new page
exports.new = function(req, res) {
		Category.find({}, function(err, categories) {

			res.render('admin', {
				title: 'imooc 后台录入页',
				categories: categories,
				movie: {}
			})
		})
	}
	//admin update movie
exports.update = function(req, res) {
	var id = req.params.id

	if (id) {
		Movie.findById(id, function(err, movie) {
			Category.find({}, function(err, categories) {
				res.render('admin', {
					title: 'imooc 后台更新页',
					movie: movie,
					categories: categories
				})
			})
		})
	}
}

//admin poster
// exports.savePoster = function(req, res, next) {
// 		var posterData = req.files.uploadPoster
// 		var filePath = posterData.path
// 		var originalFilename = posterData.originalFilename //上传文件的原始名字
// 		console.log(req.files)
// 		console.log('>>>>>>>>>>>>>>>>')
// 		if (originalFilename) {
// 			fs.readFile(filePath, function(err, data) {
// 				var timeStamp = new Date().getTime()
// 				var type = posterData.type.split('/')[1]
// 				var poster = timeStamp + '.' + type
// 				var newPath = path.join(__dirname, '../../', '/public/upload/' + poster)
// 				fs.writeFile(newPath, data, function(err) {
// 					req.poster = poster
// 					next()

// 				})
// 			})
// 		} else {
// 			next()
// 		}
// admin post movie
exports.save = function(req, res) {
	var id = req.body.movie._id;

	var movieObj = req.body.movie;
	var _movie;
	console.log(id + '--' + JSON.stringify(movieObj) + '---')


	// if (req.poster) {
	// 	movieObj.poster = req.poster
	// }


	if (id) { //更新数据
		console.log('if里面')
		Movie.findById(id, function(err, movie) {
			if (err) {
				console.log(err)
			}

			_movie = _.extend(movie, movieObj)
				// console.log(JSON.stringify(movie) + '-------------------')
				// console.log(JSON.stringify(movieObj) + '-------------------')

			_movie.save(function(err, movie) {
				if (err) {
					console.log(err)
				}
				res.redirect('/movie/' + movie._id)
			})
		})
	} else { // 新增数据
		console.log('else 里面')
		_movie = new Movie(movieObj)
		var categoryId = movieObj.category
		var categoryName = movieObj.categoryName
		console.log(categoryId)
		console.log(categoryName)
		_movie.save(function(err, movie) {
			if (err) {
				console.log(err)
			}

			if (categoryId) {
				console.log('已有的旧分类')
				Category.findById(categoryId, function(err, category) {
					category.movies.push(movie._id)
					category.save(function(err, category) {
						res.redirect('/movie/' + movie._id)
					})
				})

			} else if (categoryName) {
				console.log('增加分类')
				var category = new Category({
					name: categoryName,
					movies: [movie._id]
				})

				category.save(function(err, category) {
					console.log(category._id)
					movie.category = category._id
					movie.save(function(err, movie) {
						res.redirect('/movie/' + movie._id)

					})

				})


			}


		})
	}


}



//list page路由
exports.list = function(req, res) {
		console.log('list')
		Movie.fetch(function(err, movies) {
			if (err) {
				console.log(err)
			}
			res.render('list', {
				title: '电影列表',
				movies: movies

			})

		})
	}
	//list delete movie
exports.del = function(req, res) {
	var id = req.query.id
	if (id) {
		Movie.remove({
			_id: id
		}, function(err, movie) {
			if (err) {
				console.log(err)
			} else {
				res.json({
					success: 1
				})
			}
		})
	}

}