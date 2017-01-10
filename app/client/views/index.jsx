'use strict'
var React = require('react');
var ReactDOM = require('react-dom');
 
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
    this.state = {message : '', results: {}};
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
    $.ajax({
      url : data.url,
      method: data.method,
      data: JSON.stringify(data.search),
      contentType: "application/json",
      dataType: 'json'
    }).then(results => {
      console.log('submitted done');
      console.log(results);
      // this.setState({poll : data, message : 'results'})
    });
  }
  componentDidMount(){
    // console.log('Main componentDidMount');
  }
  componentWillMount(){
    // console.log('Main componentWillMount');
    var apiUrl = window.location.origin + '/api/:id';
    $.ajax({
      url : apiUrl,
      method: 'GET'
    }).then(auth => {
      this.setState({auth})
    })
  }
  render(){
  console.log('Main this.state');
  console.log(this.state);
    return(
      <div>
        <h1>React Template Test</h1>
        <Search cb={this.callBack}></Search>
      </div>
    )
  }
}

const Search = React.createClass({
  handler(e){
    e.preventDefault();
    console.log('Search Handler');
    console.log(this.refs.input.value);
    this.props.cb('/api/search', 'POST', this.refs.input.value)
  },
  render(){
    console.log('Search');
    console.log(this.props);
    return (
      <form id='search'>
        <label>Enter an Address</label>
      <input type='text' ref='input' id='input'></input>
        <button onClick={this.handler}>Enter</button>
      </form>
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

ReactDOM.render(
  <Main />,
  document.getElementById('content')
);
