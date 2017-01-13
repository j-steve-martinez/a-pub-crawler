'use strict'
var React = require('react');
var ReactDOM = require('react-dom');
// var ReactBootstrap = require('react-bootstrap');
// var Nav = ReactBootstrap.Nav;
// var NavItem = ReactBootstrap.NavItem;
// var NavDropdown = ReactBootstrap.NavDropdown;
// var MenuItem = ReactBootstrap.MenuItem;

function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        if (decodeURIComponent(pair[0]) == variable) {
            return decodeURIComponent(pair[1]);
        }
    }
    // console.log('Query variable %s not found', variable);
}

function getColors(num){
  // console.log('getting colors');
  var data = {c : [], bg : []};
  var myColors = Please.make_color({
    format: 'rgb',
    colors_returned: num
  });
  myColors.forEach(item => {
    var color = 'rgba(' + item.r + ', ' + item.g + ', ' + item.b + ', ' + '1)';
    var bg = 'rgba(' + item.r + ', ' + item.g + ', ' + item.b + ', ' + '0.2)';
    data.c.push(color);
    data.bg.push(bg);
  });
  // console.log(data);
  return data;
}

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
    console.log('Main callBack called');
    console.log('url ' + url);
    console.log('method ' + method);
    console.log('search: ');
    console.log(address);
    var appUrl = window.location.origin + url;
    var search = { address : address};
    var data = {url : appUrl, method: method, search : search};
    this.getData(data);
  }
  getData(data){
    console.log('getData data');
    console.log(data);
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
      console.log('submitted done');
      // console.log(results);
      console.log('start data');
      console.log(data.url);
      if (data.url.indexOf('rsvp') >= 0) {
        // var lastSearch = localStorage.getItem('lastSearch');
        console.log('url was /api/:id/rsvp');
        console.log('doing /api/search');
        var lastSearch = localStorage.getItem('lastSearch');
        this.callBack('/api/search', 'POST', lastSearch);
      } else {
        console.log('get data setting state');
        console.log(data.url);
        // Put the results into storage
        localStorage.setItem('results', JSON.stringify(results));
        this.setState({results : results, message : 'results'})
      }

    });
  }
  componentDidMount(){
    console.log('Main componentDidMount');
    console.log(this.state.auth);
  }
  componentWillMount(){
    console.log('Main component WillMount');
    var apiUrl = window.location.origin + '/api/:id';
    $.ajax({
      url : apiUrl,
      method: 'GET'
    }).then(auth => {
      // Retrieve the object from storage
      // var message, results, lastSearch, rsvp;
      // console.log('checking auth');
      // console.log(auth.id);
      // if (auth.id !== false) {
        // console.log('logged in');
        // message = 'ok';
        // results = JSON.parse(localStorage.getItem('results'));
        // lastSearch = localStorage.getItem('lastSearch');
        // pubId = localStorage.getItem('rsvp');
        // // do rsvp for last item clicked now that auth is ok
        // var rsvp = { uid = auth.id, pubID : pubId}
        // console.log('auth starting rsvp');
        // this.getData('/api/:id/rsvp', 'POST', rsvp);
        // // localStorage.removeItem('lastSearch');
        // // localStorage.removeItem('rsvp');
        // console.log('auth setting state');
        this.setState({auth})
      // }
    })
  }
  render(){
    console.log('Main this.state');
    console.log(this.state);
    console.log('message');
    console.log(this.state.message);
    if (this.state.auth.id !== false && this.state.message === '') {
      var lastSearch = localStorage.getItem('lastSearch');
      this.callBack('/api/search', 'POST', lastSearch);
    }
    var results;
    this.state.message === '' ?
      results = null :
      results = <List cb={this.callBack} data={this.state.results} auth={this.state.auth}/>;
    return(
      <div>
        <Header />
        <Search cb={this.callBack}></Search>
        {results}
      </div>
    )
  }
}

const Search = React.createClass({
  handler(e){
    e.preventDefault();
    console.log('Search Handler');
    console.log(this.refs.input.value);
    localStorage.setItem('lastSearch', this.refs.input.value);
    this.props.cb('/api/search', 'POST', this.refs.input.value);
  },
  render(){
    console.log('Search');
    console.log(this.props);
    return (
      <div>
        <nav className="navbar navbar-default">
          <div className="container-fluid">
            <div className="navbar-header">
              <div className="navbar-brand">
                <span>Pub Crawler</span>
              </div>
            </div>
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
    console.log('List Handler');
    console.log(this.props.data[e.target.id].id);
    localStorage.setItem('rsvp', this.props.data[e.target.id].id);
    if (this.props.auth.id !== false) {
      e.preventDefault();
      var data = {uid: this.props.auth.id, pubId : this.props.data[e.target.id].id}
      this.props.cb('/api/:id/rsvp', 'POST', data);
    }

  },
  render(){
    console.log('List');
    console.log(this.props);
    // TODO: replace mock data
    // var count = 0;
    // create a list of bar links
    var pubs = this.props.data.map((value, key, arr) => {
      var item = (
        <a href='/auth/twitter' id={key} onClick={this.handler} className="list-group-item" key={key}>
          <img id={key}  className='image' src={value.image_url} />
            <span id={key}  className='badge' className="badge">Attending {value.rsvp}</span>
          <span id={key} className='title'> {value.name} </span>
          <div id={key} className='description'> {value.snippet_text} </div>
        </a>
        )
      return item;
    });

    return (
      <div className="list-group">
        {pubs}
      </div>
    )
  }
})

const Btn = React.createClass({
  render () {
    // mock props
    var count = 1;
    return (
      <a href="#">
        <button className="btn btn-success btn-sm">{count} RSVP</button>
      </a>
    )
  }
})

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

ReactDOM.render(
  <Main />,
  document.getElementById('content')
);
