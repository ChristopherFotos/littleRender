import { html } from 'lit';
import { makeComponent } from './littleRender';
import { store } from './app.js';
import { v4 as uuid } from 'uuid';

const timer = (data, init, _self) => {
	if (store[init.id] > init.maxWidth) clearInterval(init.stopId);

	return html`<span class="timer" style="width: ${store[init.id]}px"></span>`;
};

timer.initializer = (instance) => {
	const id = uuid();

	console.log('INITIALIZER THIS: ', instance);
	const stopId = setInterval(() => {
		store[id] ? (store[id] = store[id] + 1) : (store[id] = 1);
	}, Math.random() * 10);

	return {
		stopId,
		id,
		maxWidth: Math.random() * 1000,
	};
};

export default makeComponent(timer);
