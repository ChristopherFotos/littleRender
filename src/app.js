import './style.scss';
import { html, render } from 'lit-html';
import makeStore from './makeStore';

const root = (data) => html`<h1>${data.text}</h1>`;

const data = {
	text: 'HELLO',
};

export const store = makeStore(root, document.body, data);

render(root(store), document.body);

intializers.initialize();

// we should have pre- and post-render hooks
