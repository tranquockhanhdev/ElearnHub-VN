"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _vite = require("vite");

var _laravelVitePlugin = _interopRequireDefault(require("laravel-vite-plugin"));

var _vite2 = _interopRequireDefault(require("@tailwindcss/vite"));

var _pluginReact = _interopRequireDefault(require("@vitejs/plugin-react"));

var _path = _interopRequireDefault(require("path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _default = (0, _vite.defineConfig)({
  plugins: [(0, _laravelVitePlugin["default"])({
    input: ['resources/js/app.jsx', 'resources/css/app.css'],
    refresh: true
  }), (0, _vite2["default"])(), (0, _pluginReact["default"])()],
  optimizeDeps: {
    include: ['react-pdf', 'plyr-react', 'plyr']
  },
  resolve: {
    alias: {
      '@': _path["default"].resolve(__dirname, 'resources/js'),
      'ziggy-js': _path["default"].resolve('vendor/tightenco/ziggy')
    }
  }
});

exports["default"] = _default;