'use strict';
var Yelp = require('yelp');
var Users = require('../models/users.js');
var Pub = require('../models/pubs.js');

function ClickHandler () {
	const yelpData = {
		consumer_key: process.env.YELP_KEY,
		consumer_secret: process.env.YELP_SECRET,
		token: process.env.YELP_TOKEN,
		token_secret: process.env.YELP_TOKEN_SECRET
	};

	this.search = (req, res) => {
		console.log('this.search');
		// console.log(req.params);
		req.on('data', (body) => {
			var data = JSON.parse(body);
			var yelp = new Yelp(yelpData);

			yelp.search({ term: 'bar alcohol', location: data.address })
				.then(function (data) {
					// console.log(data.businesses[0]);
					Pub.find({}, (err, pubs)=>{
						if (err) throw err;
						var rsvp;
						pubs.forEach(pub=>{
							// console.log(pub.pubId);
							rsvp = data.businesses.map(item=>{
								// set rsvp count if undefined
								if (item.rsvp === undefined) {
									item.rsvp = 0;
								}
								// count the pub rsvp
								if (item.id === pub.pubId) {
									// console.log('item: ' + item.id);
								  // console.log('pub : ' + pub.pubId);
									var count = item.rsvp;
									count += 1;
									item.rsvp = count;
								}
								// console.log(item.rsvp);
								return item;
							});
						});
						// console.log('sending search results to client');
						res.send(rsvp);
					});


					// res.json(data);
				})
				.catch(function (err) {
					console.error(err);
				});
		})
	}
	// this.getAllPolls = function(req, res){
	// 	Poll.find().exec((err, data) => {
	// 		if (err) throw err;
	// 		res.json(data);
	// 	});
	// }
	//
	this.addDefault = ()=>{
		Pub.find({}, (err, data) => {
			if (err) throw err;
			if (data.length === 0) {
				// add default poll
				console.log('add default');
				var pub = new Pub({
					pubId : "default-pub-no-city",
					uid : 'default',
				});
				pub.save((err, data) => {
					if (err) throw err;
					console.log(data);
				})
			}
		});
	}
	//
	this.rsvp = (req, res)=>{
		console.log('starting rsvp');
		req.on('data', function(body) {
			var data = JSON.parse(body);
			console.log('rsvp data');
			console.log(data);
			Pub.find({pubId : data.address.pubId, uid : data.address.uid}, (err, pub) => {
				if (err) throw err;
				console.log('pub data');
				console.log(pub);
				if (pub.length) {
					res.end();
				} else {
					console.log('adding rsvp');
					// add the rsvp
					var rsvp = new Pub();
					rsvp.pubId 	= data.address.pubId;
					rsvp.uid		= data.address.uid;
					rsvp.save((err, pub)=>{
						if (err) throw err;
						console.log('rsvp saved: sending json');
						res.json({isSaved : true, pub : pub});
					});
				}
			});
		});
	}


	// // get all user polls
	// this.getPolls = function(req, res){
	// 	var id = req.user.id;
	// 	Poll
	// 		.find()
	// 		.exec((err, data) => {
	// 			if (err) throw err;
	// 			// console.log('getUserPolls');
	// 			var polls = data.filter(poll => {
	// 				if (poll.uid.toString() === id) {
	// 					return poll;
	// 				}
	// 			});
	// 			res.json(polls);
	// 		});
	// }
	//
	// this.addPoll = (req, res) => {
	// 	req.on('data', function(body) {
	//
	// 		var data = JSON.parse(body);
	//
	// 		Poll.find({name : data.name, uid : data.uid}, (err, poll) => {
	// 			if (err) throw err;
	//
	// 			if (poll.length) {
	// 				// console.log('sending json');
	// 				res.json({isExists : true, isSaved : false});
	// 			} else {
	// 				var newPoll = new Poll(data);
	//
	// 				// Saving it to the database.
	// 				newPoll.save(function (err, data) {
	// 					if (err) {
	// 						// console.log ('Error on save!');
	// 						res.json({isExists : false, isSaved : false});
	// 					}
	// 					// console.log('data saved');
	// 					res.json({isExists : false, isSaved : true, poll : data});
	// 				});
	// 			}
	// 		});
	// 	});
	// }
	//
	// this.getPoll = (req, res) => {
	// 	// console.log('getPoll');
	// 	Poll
	// 		.findOne({'_id': req.params.id})
	// 		.exec((err, poll) => {
	// 			if (err) throw err;
	// 			res.json(poll)
	// 		});
	// }
	//
	// this.takePoll = (req, res) => {
	// 	// console.log('editPoll');
	// 	// console.log(req.params.id);
	// 	req.on('data', function(body) {
	//
	// 		var data = JSON.parse(body);
	//
	// 		Poll
	// 			.findOneAndUpdate({
	// 				'_id': data.id,
	// 				'name' : data.name,
	// 				'list.key' : data.key
	// 			},
	// 				{ $inc : { 'list.$.value': 1 }},
	// 				// get the update poll
	// 				{ new: true }
	// 			)
	// 			.exec((err, poll) => {
	// 				if (err) throw err;
	// 				res.json(poll);
	// 			});
	// 	});
	// }
	//
	// this.editPoll = (req, res) => {
	// 	// console.log('editPoll');
	// 	req.on('data', body => {
	//
	// 		var data = JSON.parse(body);
	//
	// 		Poll
	// 			.update({
	// 				'_id': req.params.poll,
	// 				'name' : data.name
	// 			},
	// 				{ $push : { list: { key: data.key, value : data.value}}}
	// 			)
	// 			.exec((err, poll) => {
	// 				if (err) throw err;
	// 				res.json(poll);
	// 			});
	// 	});
	// }
	//
	// this.delPoll = (req, res) => {
	// 	// console.log('del getPoll');
	// 	Poll
	// 	  .findByIdAndRemove(req.params.poll)
	// 		.exec((err, poll) => {
	// 			if (err) throw err;
	// 			res.json(poll)
	// 		});
	// }

}

module.exports = ClickHandler;
