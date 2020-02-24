webpackJsonp([1],{

/***/ 477:
/***/ (function(module, exports, __webpack_require__) {

	"use strict";

	exports.__esModule = true;

	var _style = __webpack_require__(222);

	var _style2 = _interopRequireDefault(_style);

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _propTypes = __webpack_require__(115);

	var _propTypes2 = _interopRequireDefault(_propTypes);

	var _reactShare = __webpack_require__(314);

	var _config = __webpack_require__(276);

	var _config2 = _interopRequireDefault(_config);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var PostShare = function PostShare(props) {
	  var _props$post = props.post,
	      slug = _props$post.fields.slug,
	      title = _props$post.frontmatter.title,
	      excerpt = _props$post.excerpt,
	      theme = props.theme;


	  var url = _config2.default.siteUrl + _config2.default.pathPrefix + slug;

	  var iconSize = 36;
	  var filter = function filter(count) {
	    return count > 0 ? count : "";
	  };

	  return _react2.default.createElement(
	    _react2.default.Fragment,
	    null,
	    _react2.default.createElement(
	      "div",
	      {
	        className: _style2.default.dynamic([["2870485220", [theme.space.inset.l, theme.space.inline.m]]]) + " " + "share"
	      },
	      _react2.default.createElement(
	        "span",
	        {
	          className: _style2.default.dynamic([["2870485220", [theme.space.inset.l, theme.space.inline.m]]]) + " " + "label"
	        },
	        "SHARE"
	      ),
	      _react2.default.createElement(
	        "div",
	        {
	          className: _style2.default.dynamic([["2870485220", [theme.space.inset.l, theme.space.inline.m]]]) + " " + "links"
	        },
	        _react2.default.createElement(
	          _reactShare.TwitterShareButton,
	          {
	            url: url,
	            title: title,
	            additionalProps: {
	              "aria-label": "Twitter share"
	            }
	          },
	          _react2.default.createElement(_reactShare.TwitterIcon, { round: true, size: iconSize })
	        ),
	        _react2.default.createElement(
	          _reactShare.GooglePlusShareButton,
	          {
	            url: url,
	            additionalProps: {
	              "aria-label": "Google share"
	            }
	          },
	          _react2.default.createElement(_reactShare.GooglePlusIcon, { round: true, size: iconSize }),
	          _react2.default.createElement(
	            _reactShare.GooglePlusShareCount,
	            { url: url },
	            function (count) {
	              return _react2.default.createElement(
	                "div",
	                {
	                  className: _style2.default.dynamic([["2870485220", [theme.space.inset.l, theme.space.inline.m]]]) + " " + "share-count"
	                },
	                filter(count)
	              );
	            }
	          )
	        ),
	        _react2.default.createElement(
	          _reactShare.FacebookShareButton,
	          {
	            url: url,
	            quote: title + " - " + excerpt,
	            additionalProps: {
	              "aria-label": "Facebook share"
	            }
	          },
	          _react2.default.createElement(_reactShare.FacebookIcon, { round: true, size: iconSize }),
	          _react2.default.createElement(
	            _reactShare.FacebookShareCount,
	            { url: url },
	            function (count) {
	              return _react2.default.createElement(
	                "div",
	                {
	                  className: _style2.default.dynamic([["2870485220", [theme.space.inset.l, theme.space.inline.m]]]) + " " + "share-count"
	                },
	                filter(count)
	              );
	            }
	          )
	        ),
	        _react2.default.createElement(
	          _reactShare.LinkedinShareButton,
	          {
	            url: url,
	            title: title,
	            description: excerpt,
	            additionalProps: {
	              "aria-label": "LinkedIn share"
	            }
	          },
	          _react2.default.createElement(_reactShare.LinkedinIcon, { round: true, size: iconSize }),
	          _react2.default.createElement(
	            _reactShare.LinkedinShareCount,
	            { url: url },
	            function (count) {
	              return _react2.default.createElement(
	                "div",
	                {
	                  className: _style2.default.dynamic([["2870485220", [theme.space.inset.l, theme.space.inline.m]]]) + " " + "share-count"
	                },
	                filter(count)
	              );
	            }
	          )
	        )
	      )
	    ),
	    _react2.default.createElement(_style2.default, {
	      styleId: "2870485220",
	      css: [".share.__jsx-style-dynamic-selector{display:-webkit-box;display:-ms-flexbox;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;-ms-flex-direction:column;-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;-webkit-box-pack:center;-ms-flex-pack:center;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;-webkit-box-align:center;-ms-flex-align:center;-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;}", ".links.__jsx-style-dynamic-selector{display:-webkit-box;display:-ms-flexbox;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-orient:horizontal;-webkit-box-direction:normal;-ms-flex-direction:row;-webkit-flex-direction:row;-ms-flex-direction:row;flex-direction:row;}", ".links.__jsx-style-dynamic-selector .SocialMediaShareButton{margin:0 0.8em;cursor:pointer;}", ".label.__jsx-style-dynamic-selector{font-size:1.2em;margin:0 1em 1em;}", "@media screen and (min-width:768px){.share.__jsx-style-dynamic-selector{-webkit-box-orient:horizontal;-webkit-box-direction:normal;-ms-flex-direction:row;-webkit-flex-direction:row;-ms-flex-direction:row;flex-direction:row;margin:" + theme.space.inset.l + ";}.label.__jsx-style-dynamic-selector{margin:" + theme.space.inline.m + ";}}"],
	      dynamic: [theme.space.inset.l, theme.space.inline.m]
	    })
	  );
	};

	PostShare.propTypes = {
	  post: _propTypes2.default.object.isRequired,
	  theme: _propTypes2.default.object.isRequired
	};

	exports.default = PostShare;
	module.exports = exports["default"];

/***/ })

});