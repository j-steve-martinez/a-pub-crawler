'use strict'
var React = require('react');
var ReactDOM = require('react-dom');

class Main extends React.Component {
  constructor(props) {
    super(props);
    // console.log('Main init');
    this.callBack = this.callBack.bind(this);
    this.getData = this.getData.bind(this);
    var auth = {id : false}
    this.state = {message : '', results: {}, auth : auth};
  }
  callBack(url, method, address){
    // console.log('Main callBack called');
    // console.log('url ' + url);
    // console.log('method ' + method);
    // console.log('search: ');
    // console.log(address);
    var appUrl = window.location.origin + url;
    var search = { address : address};
    var data = {url : appUrl, method: method, search : search};
    this.getData(data);
  }
  getData(data){
    // console.log('Main getData data');
    // console.log(data);
    var header = {};
    if (data.method === 'GET') {
      header.url = data.url;
      header.method = data.method;
    } else {
      header.url = data.url;
      header.method = data.method;
      header.data = JSON.stringify(data.search);
      header.contentType = "application/json";
      header.dataType = 'json';
    }
    $.ajax(header).then(results => {
      // console.log('Main getData done');
      // console.log(results);
      // console.log('Main getData(data)');
      // console.log(data.url);
      if (data.url.indexOf('rsvp') >= 0) {
        // var lastSearch = localStorage.getItem('lastSearch');
        localStorage.removeItem('rsvp')
        // console.log('url was /api/:id/rsvp');
        // console.log('doing /api/search');
        var lastSearch = localStorage.getItem('lastSearch');
        this.callBack('/api/search', 'POST', lastSearch);
      } else {
        // console.log('Main getData setting state');
        // console.log(data.url);
        // Put the results into storage
        localStorage.setItem('results', JSON.stringify(results));
        this.setState({results : results, message : 'results'})
      }

    });
  }
  componentWillMount(){
    // console.log('Main component WillMount');
    var apiUrl = window.location.origin + '/api/:id';
    $.ajax({
      url : apiUrl,
      method: 'GET'
    }).then(auth => {
      // Retrieve the object from storage
      var message, results, lastSearch, rsvp;
      results = JSON.parse(localStorage.getItem('results'));
      if (auth.id === false) {
        message = '';
      } else {
        message = 'results';
      }
      // console.log('componentWillMount auth setting state');
      this.setState({auth, message : message, results : results});
    })
  }
  render(){
    // console.log('Main render this.state');
    // console.log(this.state);
    // console.log('Main render message');
    // console.log(this.state.message);
    // console.log('Main render auth');
    // console.log(this.state.auth.id);

    /**
     * After logging into twitter
     * check that id is not false then get the
     * id of the rsvp from localstorage 
     * and update the remote database
     */
    if (this.state.auth.id !== false) {
      var pubId = localStorage.getItem('rsvp');
      if (pubId !== null) {
        var data = {pubId : pubId, uid : this.state.auth.id}
        this.callBack('/api/:id/rsvp', 'POST', data);
      }
    }
    /**
     * If logged in and no status message
     * get the last search from localStorage
     * and query yelp with last search address
     */
    if (this.state.auth.id !== false && this.state.message === '') {
      var lastSearch = localStorage.getItem('lastSearch');
      this.callBack('/api/search', 'POST', lastSearch);
    }
    /**
     * if not logged in don't show a list
     * else show the last query results
     */
    var results;
    if (this.state.auth.id === false && this.state.message === '') {
      // console.log('Main render results will be null');
      results = null;
    } else {
      // console.log('Main render results will be List');
      results = <List cb={this.callBack} data={this.state.results} auth={this.state.auth}/>;
    }

    return(
      <div>
        <Header />
        <Search cb={this.callBack}></Search>
        {results}
        <Footer />
      </div>
    )
  }
}

const Search = React.createClass({
  getInitialState(){
    // console.log('Search getInitialState');
    return {message : ''};
  },
  handler(e){
    e.preventDefault();
    // console.log('Search Handler');
    // console.log(this.refs.input.value);

    /**
     * if search value is empty give error message
     * else do a search
     */
    if (this.refs.input.value === '') {
      var message = 'Please Enter an Address or City or Zip!';
      this.setState({message : message});
    } else {
      localStorage.setItem('lastSearch', this.refs.input.value);
      this.props.cb('/api/search', 'POST', this.refs.input.value);
      this.setState({message : ''});
    }
  },
  render(){
    // console.log('Search render');
    // console.log(this.state);
    var alert = <div id='warning'>{this.state.message}</div> ;
    return (
      <div>
        <nav className="navbar navbar-default">
          <div className="container-fluid">
            <div className="navbar-header">
              <div className="navbar-brand">
                <span>Pub Crawler</span>
              </div>
            </div>
            {alert}
            <form id='search' className="navbar-form navbar-left" role="search">
              <div className="form-group">
                <input type='text' ref='input' className="form-control" placeholder="Enter an Address"></input>
              </div>
              <button onClick={this.handler} type="submit" className="btn btn-warning">Search</button>
            </form>
          </div>
        </nav>
      </div>
    )
  }
});

const List = React.createClass({
  handler(e){
    // e.preventDefault();
    // console.log('List Handler');
    // console.log(e.target.id);
    // console.log(this.props.data[e.target.id].id);
    var method, rsvp = 'rsvp-' + this.props.data[e.target.id].id;

    /**
     * If logged in check to see if rsvp value is stored
     *  if value then remove the value from localStorage
     *  if no value set the value to localstorage
     * and set the XMLHttpRequest method
     */
    if (this.props.auth.id !== false) {
      e.preventDefault();
      if (localStorage.getItem(rsvp)) {
        // console.log('removing localStorage' + rsvp);
        localStorage.removeItem(rsvp);
        method = 'PUT';
      } else {
        // console.log('setting localStorage' + rsvp);
        localStorage.setItem(rsvp, true);
        method = 'POST';
      }
    
      var data = {uid: this.props.auth.id, pubId : this.props.data[e.target.id].id}
      this.props.cb('/api/:id/rsvp', method, data);
    }

  },
  render(){
    // console.log('List render');
    // console.log(this.props);

    /**
     * Render data if it exists
     * else set to null
     */
    if (this.props.data.length !== undefined) {
      var pubs = this.props.data.map((value, key, arr) => {
        var item = (
          <div className="list-group-item" key={key}>
            <a href="/auth/twitter" onClick={this.handler}>
              <button id={key} className='btn btn-warning btn-xs attending'>RSVP <span className='badge'> {value.rsvp}</span></button>
            </a>
            <div className='imgContainer'><img className='img-rounded image' src={value.image_url} /></div>
            <a className='title' href={value.url}  target='_blank'>{value.name}</a>
            <div className='description'> {value.snippet_text} </div>
          </div>
          )
        return item;
      });
    } else {
      var pubs = null;
    }

    return (
      <div className="list-group">
        {pubs}
      </div>
    )
  }
});


const Tweet = React.createClass({
  componentDidMount(){
    // console.log(this.props.poll);
    var id = this.props.poll._id;
    var name = 'New Poll: ' + this.props.poll.name;
    var url = window.location.href + '?poll=' + id;
    var elem = document.getElementById('twit-share');
    var data = {};
    data.text = name;
    data.size = 'large';
    twttr.widgets.createShareButton(url, elem, data);
  },
  render(){
    return <a id='twit-share'></a>
  }
});

const Header = React.createClass({
  render(){
    return (
      <div className='header'>
        <div id='image' ><img id='beer' src="/public/img/beer.png" /></div>
        <h1>Looking for Somewhere to go tonight?</h1>
        <h4>Search the bar scene and RSVP</h4>
      </div>
    )
  }
});

const Footer = React.createClass({
  render(){
    return (
      <footer>
        <div>
          <span className='fname'>Created By: </span>  
          <a href="https://github.com/j-steve-martinez" target='_blank'>J. Steve Martinez</a>
        </div>
        <div>
          <span className='fname'>Source: </span>
          <a href="https://github.com/j-steve-martinez/a-pub-crawler" target='_blank'>GitHub</a>
        </div>
        <div>
         <span className='fname'>Site: </span>
          <a href="http://a-pub-crawler.herokuapp.com/" target='_blank'>Heroku</a>
        </div>
        <div>
          <span> Powered by: </span>
          <a href='https://www.yelp.com' target='_blank'>Yelp</a>
        </div>
      </footer>
    )
  }
});

ReactDOM.render(
  <Main />,
  document.getElementById('content')
);
