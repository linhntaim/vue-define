"use strict";Object.defineProperty(exports,"__esModule",{value:true});exports.getenv=getenv;var _dotenvConversion=_interopRequireDefault(require("dotenv-conversion"));function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj}}function getenv(){var name=arguments.length>0&&arguments[0]!==undefined?arguments[0]:null;var def=arguments.length>1&&arguments[1]!==undefined?arguments[1]:null;return _dotenvConversion.default.getenv(name,def)}
//# sourceMappingURL=utils.js.map