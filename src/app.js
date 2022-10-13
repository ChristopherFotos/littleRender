import './style.scss';
import { html, render } from 'lit-html';
import { makeStore, initializers } from './littleRender';

const root = (data) => html`<h1>${data.text}</h1>`;

const data = {
	text: 'HELLO',
};

export const store = makeStore(root, document.body, data);
render(root(store), document.body);
initializers.initialize();

// we should have pre- and post-render hooks
