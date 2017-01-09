'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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

function getData(data) {
  var _this = this;

  var id, url, method, type, route;
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
    id = 'none';
    url = '/api/allPolls';
    method = 'GET';
    type = 'all';
    route = '/';
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
    url: url,
    method: method
  }).then(function (res) {
    _this.props.cb(route, type, res);
  });
}

function getColors(num) {
  // console.log('getting colors');
  var data = { c: [], bg: [] };
  var myColors = Please.make_color({
    format: 'rgb',
    colors_returned: num
  });
  myColors.forEach(function (item) {
    var color = 'rgba(' + item.r + ', ' + item.g + ', ' + item.b + ', ' + '1)';
    var bg = 'rgba(' + item.r + ', ' + item.g + ', ' + item.b + ', ' + '0.2)';
    data.c.push(color);
    data.bg.push(bg);
  });
  // console.log(data);
  return data;
}

var Main = function (_React$Component) {
  _inherits(Main, _React$Component);

  function Main(props) {
    _classCallCheck(this, Main);

    // console.log('Main init');
    var _this2 = _possibleConstructorReturn(this, (Main.__proto__ || Object.getPrototypeOf(Main)).call(this, props));

    _this2.callBack = _this2.callBack.bind(_this2);
    _this2.state = { message: '' };
    return _this2;
  }

  _createClass(Main, [{
    key: 'callBack',
    value: function callBack(path, type, data) {
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
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      // console.log('Main componentDidMount');
    }
  }, {
    key: 'componentWillMount',
    value: function componentWillMount() {
      var _this3 = this;

      // console.log('Main componentWillMount');
      var apiUrl = window.location.origin + '/api/:id';
      $.ajax({
        url: apiUrl,
        method: 'GET'
      }).then(function (auth) {
        _this3.setState({ auth: auth });
      });
    }
  }, {
    key: 'render',
    value: function render() {
      console.log('Main this.state');
      console.log(this.state);
      return React.createElement(
        'div',
        null,
        React.createElement(
          'h1',
          null,
          'React Template Test'
        )
      );
    }
  }]);

  return Main;
}(React.Component);

ReactDOM.render(React.createElement(Main, null), document.getElementById('content'));