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
		// console.log('this.search');
		// console.log(req.params);
		req.on('data', (body) => {
			var data = JSON.parse(body);
			var yelp = new Yelp(yelpData);

			yelp.search({ term: 'nightlife alcohol', location: data.address })
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
						// console.log(rsvp);
						res.send(rsvp);
					});
				})
				.catch(function (err) {
					console.error(err);
				});
		})
	}

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

	this.rsvp = (req, res)=>{
		// console.log('starting rsvp');
		// wait for all data to be sent
		req.on('data', function(body) {
			var data = JSON.parse(body);
			// console.log('rsvp data');
			// console.log(data);
			// check to see if there is a pub id with the user id
			Pub.find({pubId : data.address.pubId, uid : data.address.uid}, (err, pub) => {
				if (err) throw err;
				// console.log('pub data');
				// console.log(pub);
				// if found end or add the pub and uid
				if (pub.length) {
					res.end();
				} else {
					// console.log('adding rsvp');
					// add the rsvp
					var rsvp = new Pub();
					rsvp.pubId 	= data.address.pubId;
					rsvp.uid	= data.address.uid;
					rsvp.save((err, pub)=>{
						if (err) throw err;
						// console.log('rsvp saved: sending json');
						res.json({isSaved : true, pub : pub});
					});
				}
			});
		});
	}

	this.wimpOut = (req, res)=>{
		// console.log('starting rsvp');
		// wait for all data to be sent
		req.on('data', function(body) {
			var data = JSON.parse(body);
			// console.log('rsvp data');
			// console.log(data);
			// check to see if there is a pub id with the user id
			Pub.find({pubId : data.address.pubId, uid : data.address.uid}, (err, pub) => {
				if (err) throw err;
				// console.log('pub data found');
				// console.log(pub);
				// if found remove
				if (pub.length) {
					// console.log('attempting to remove pub data');
					Pub.remove({pubId : data.address.pubId, uid : data.address.uid}, (err, pub) => {
						if (err) throw err;
						// console.log('data removed');
						// console.log(pub);
						res.json({isRemoved : true, pub : pub})
					})
				}
			});
		});
	}
}

module.exports = ClickHandler;
