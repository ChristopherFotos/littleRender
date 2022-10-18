import './style.scss';
import { render, html } from 'lit';
import { makeStore } from './littleRender';
import root from './root';

const parent = () => {
	function click() {
		store.timers = [...store.timers, 0];
	}

	return html`
		<button @click=${click}>Add a timer</button>
		<div>${store.timers.map((t) => root())}</div>
	`;
};

export const store = makeStore(parent, document.body, { timers: [1] });

render(parent(), document.body);
