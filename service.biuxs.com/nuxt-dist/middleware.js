const middleware = {}

middleware['authorities'] = require('..\\client\\middleware\\authorities.js')
middleware['authorities'] = middleware['authorities'].default || middleware['authorities']

middleware['stats'] = require('..\\client\\middleware\\stats.js')
middleware['stats'] = middleware['stats'].default || middleware['stats']

middleware['test'] = require('..\\client\\middleware\\test.js')
middleware['test'] = middleware['test'].default || middleware['test']

export default middleware
