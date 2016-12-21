var Movie = require('../modules/movie')
var Category = require('../modules/category')
	//index page路由
exports.index = function(req, res) {
		// console.log('user in session')
		// console.log(req.session.user)

		Category
			.find({})
			.populate({
				path: 'movies',
				select: 'name poster year',
				options: {
					limit: 5
				}
			})
			.exec(function(err, categories) {
				if (err) {
					console.log(err)
				}
				res.render('index', {
					title: 'imooc首页',
					categories: categories


				})
			})

	}
	//search page
exports.search = function(req, res) {
	var catId = req.query.cat
	var page = parseInt(req.query.p, 10) || 0
	var q = req.query.q
	var count = 2
	var index = page * count
	console.log(catId + '----' + page + '----' + index)
	if (catId) { //搜索电影种类

		Category
			.find({
				_id: catId
			})
			.populate({
				path: 'movies',
				select: 'name poster year'

			})
			.exec(function(err, categories) {
				if (err) {
					console.log(err)
				}
				var category = categories[0] || {}
				var movies = category.movies || []
				var results = movies.slice(index, index + count)
				res.render('results', {
					title: '搜索结果列表',
					keyword: category.name,
					movies: results,
					currentPage: page + 1,
					totalPage: Math.ceil(movies.length / count),
					query: 'cat=' + catId


				})
			})
	} else {
		Movie
			.find({
				name: new RegExp(q + '.*',
					'i')
			})
			.exec(function(err, movies) {
				if (err) {
					console.log(err)
				}
				var results = movies.slice(index, index + count)
				res.render('results', {
					title: '搜索结果列表',
					keyword: q,
					movies: results,
					currentPage: page + 1,
					totalPage: Math.ceil(movies.length / count),
					query: 'q=' + q


				})
			})


	}
}