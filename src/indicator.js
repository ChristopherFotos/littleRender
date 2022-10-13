import { html } from 'lit-html';
import { store } from './app.js';
import initializers from './initializers';

// here's a problem. how do we get the initial setup for a component to run?
// the ability to run a component logic before the component is rendered isn't great,
// it makes it easy to write buggy code.

initializers.indicator = function () {
	const updateIndicator = () => {
		store.width = store.width + 1;
	};

	store.cancelIndicator = setInterval(updateIndicator, 30);
};

const cancelIndicator = () => clearInterval(store.cancelIndicator);

const indicator = () =>
	html`
		<span style="width:${store.width}px" id="indicator">hh</span>
		<button @click=${cancelIndicator}>STOP GROWING</button>
	`;

export default indicator;
