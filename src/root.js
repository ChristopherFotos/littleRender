import { html } from 'lit';
import { makeComponent } from './littleRender';
import { store } from './app.js';
import { v4 as uuid } from 'uuid';

const timer = (data, { initialValues, _self }) => {
	if (store[initialValues.id] > initialValues.maxWidth)
		clearInterval(initialValues.stopId);

	return html`<span
		class="timer"
		style="width: ${store[initialValues.id]}px"
	></span>`;
};

timer.initializer = (_data, instance) => {
	const id = uuid();

	console.log('INITIALIZER THIS: ', instance);
	const stopId = setInterval(() => {
		console.log('tick');
		store[id] ? (store[id] = store[id] + 10) : (store[id] = 10);
	}, 40);

	return {
		stopId,
		id,
		maxWidth: Math.random() * 1000,
	};
};

export default makeComponent(timer);
