'use strict';

let mongoose = require('mongoose');
let bcrypt = require('bcrypt');

let constants = require('./Config/constants.js');

let Schema = mongoose.Schema;

let UserSchema = new Schema({
	username:{type:String},
	email:{type:String},
	password:{type:String},
	created_at:{type:Date,default:new Date()},
	modified_at:{type:Date},
	profile_image:{type:String},
	description:{type:String,default:null},
	favourites_count:{type:Number},
	
	
});

UserSchema.pre('save',function(next){

	let user = this;
	let SALT_WORK_FACTOR = 10;
	
	bcrypt.genSalt(SALT_WORK_FACTOR,function(err,salt){
		
		if(err){
			return next(err);
		}
		
		bcrypt.hash(user.password,salt,function(err,hash){
			
			if(err)
			{
				return next(err);
			}

			user.password = hash;
			next();
		});
	});

});

//schemaname.methods.fucntion_name predefined method to add methods to models 
UserSchema.methods.comparePassword = function(candidatePassword,cb){
	
	bcrypt.compare(candidatePassword,this.password,function(err,isMatch){
		if(err)
			return cb(err);

		cb(null,isMatch);
	}
	
)};

module.exports = mongoose.model('User',UserSchema,'users');
