var Yelp = require('yelp');

// addressit
function YelpServer(){
  // search yelp
  this.search = (req, res) => {
    console.log('this.search');
    console.log(req.params);
    req.on('data', (body) => {
      var data = JSON.parse(body);
      // console.log('got body in search:');
      // console.log(data);
      // console.log(configYelp);
      // console.log('.env yelp.server.js');
      // console.log(process.env.YELP_KEY);
      // console.log(process.env.YELP_SECRET);
      // console.log(process.env.YELP_TOKEN);
      // console.log(process.env.YELP_TOKEN_SECRET);
      var yelp = new Yelp({
        consumer_key: process.env.YELP_KEY,
        consumer_secret: process.env.YELP_SECRET,
        token: process.env.YELP_TOKEN,
        token_secret: process.env.YELP_TOKEN_SECRET
      });
      // console.log('yelp obj');
      // console.log(yelp);
      // res.json({success : data})
      yelp.search({ term: 'bar alcohol', location: data.address })
        .then(function (data) {
          console.log(data);
          res.send(data);
          // res.json(data);
        })
        .catch(function (err) {
          console.error(err);
        });
    })
  }
}

module.exports = YelpServer;
