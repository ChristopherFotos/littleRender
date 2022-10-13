import makeStore from './data';
import root from './app.js';

const data = {
	text: 'GAAAY22',
	booty: 'imgay',
	list: [],
	width: 10,
};

const store = makeStore(root(), document.body, data);

export default store;
