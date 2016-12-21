var _ = require('underscore')
var Movie = require('../modules/movie')
var Category = require('../modules/category')



//admin new page
exports.new = function(req, res) {
  res.render('category_admin', {
    title: 'imooc 后台分类录入页',
    category: {}

  })
}

// admin post movie
exports.save = function(req, res) {
  var _category = req.body.category;
  console.log(req.body)
  console.log('Category-------')
  var category = new Category(_category)

  category.save(function(err, movie) {
    if (err) {
      console.log(err)
    }
    res.redirect('/admin/category/list')
  })



}


//Category list page路由
exports.list = function(req, res) {
  console.log('list')
  Category.fetch(function(err, categories) {
    if (err) {
      console.log(err)
    }
    res.render('categoryList', {
      title: '用户列表',
      categories: categories

    })

  })
}