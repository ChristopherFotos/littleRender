import './style.scss';
import { html, render } from 'lit-html';
import makeStore from './data';
import intializers from './initializers.js';
import btn from './comp';
import comp3 from './comp3';

const root = (data) => html`<h1>${data.text}</h1>
	${btn(data.text)} ${comp3(data.text)}`;

const data = {
	text: 'GAAAY22',
	booty: 'imgay',
	list: [],
	width: 10,
};

export const store = makeStore(root, document.body, data);

render(root(store), document.body);

intializers.initialize();

// we should have pre- and post-render hooks
