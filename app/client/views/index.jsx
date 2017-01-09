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

function getData(data){
  var id,url,method,type,route;
  // console.log('url');
  // console.log(data);
  var arr = data.split('/');
  // console.log(arr);
  if (arr[2] === 'poll') {
    // console.log('poll');
    id = arr[3];
    url = '/api/poll/' + id;
    route = url;
    method = 'GET';
    type = 'poll';
  } else if (arr[2] === 'allPolls') {
    // console.log('allPolls');
    id = 'none'
    url = '/api/allPolls';
    method = 'GET';
    type = 'all'
    route = '/'
  } else {
    id = arr[2];
    url = '/api/:id/profile';
    route = '/profile/' + id;
    method = 'GET';
    type = 'profile';
  }

  // console.log('navlink all data');
  // console.log(id);
  // console.log(url);
  // console.log(route);
  // console.log(method);
  // console.log(type);

  $.ajax({
    url : url,
    method: method
  })
  .then(res => {
    this.props.cb(route, type, res);
  });
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
    this.state = {message : ''};
  }
  callBack(path, type, data){
    // console.log('Main callBack called');
    // console.log('path ' + path);
    // console.log('type ' + type);
    // console.log('data: ');
    // console.log(data);
    switch (type) {
      case 'get':
      // console.log('cb get');
        break;
      case 'put':
        // console.log('cb put');
        break;
      case 'post':
        // console.log('cb post');
        break;
      case 'delete':
        // console.log('cb delete');
        break;
      default:
        // console.log('cb default');
    }
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
      </div>
    )
  }
}

ReactDOM.render(
  <Main />,
  document.getElementById('content')
);
