var mongoose = require('mongoose')
var bcrypt = require('bcrypt')
var SALT_WORK_FACTOR = 10;

var UserSchema = mongoose.Schema({
	name: {
		unique: true,
		type: String
	},
	password: {
		unique: true,
		type: String
	},
	//0:normal
	//1:verified
	//2:professional
	//3-9 ...
	//>10: admin
	//>50: superadmin
	role: {
		type: Number,
		default: 0
	},
	meta: {
		creatAt: {
			type: Date,
			default: Date.now()
		},
		updateAt: {
			type: Date,
			default: Date.now()
		}
	}
})

UserSchema.pre('save', function(next) {
	var user = this
	if (this.isNew) {
		this.meta.creatAt = this.meta.updateAt = Date.now()
	} else {
		this.meta.updateAt = Date.now()
	}

	bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
		if (err) return next(err)
		bcrypt.hash(user.password, salt, function(err, hash) {
			if (err) return next(err)
			user.password = hash
			next()

		})

	})

})

UserSchema.methods = {
	comparePassword: function(_password, cb) {
		var user = this
		bcrypt.compare(_password, this.password, function(err, isMatch) {
			if (err) return cb(err)

			cb(null, isMatch)
		})
	}
}


UserSchema.statics = {
	fetch: function(cb) {
		return this
			.find({})
			.sort('meta.updateAt')
			.exec(cb)
	},
	findById: function(id, cb) {
		return this
			.findOne({
				_id: id
			})
			.exec(cb)
	},

}

module.exports = UserSchema