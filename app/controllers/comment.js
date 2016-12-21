var mongoose = require('mongoose')
var Comment = require('../modules/comment')


// comment save
exports.save = function(req, res) {
  var _comment = req.body.comment
  console.log('_comment  提交的评论内容')
  console.log(_comment)
  var movieId = _comment.movie
  console.log(movieId)


  if (_comment.cid) {
    Comment.findById(_comment.cid, function(err, comment) {
      var reply = {
        from: _comment.from,
        to: _comment.tid,
        content: _comment.content

      }

      comment.reply.push(reply)

      comment.save(function(err, comment) {
        if (err) {
          console.log(err)
        }
        res.redirect('/movie/' + movieId)
      })
    })
  } else {
    console.log('提交评论  else里面')
    var comment = new Comment(_comment)
    console.log(comment)
    comment.save(function(err, comment) {
      if (err) {
        console.log(err)
      }
      res.redirect('/movie/' + movieId)
    })
  }



}