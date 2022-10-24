import { html } from 'lit';
import { makeComponent } from './littleRender';
import { store } from './app.js';

const numRaw = (data, { addState, addInit, addDependency, _self }) => {
	// the newly set state isn't reflecting here
	const [state, setState, s1id] = addState(store, 1);
	const [state2, setState2, s2id] = addState(store, 2);
	const [state3, setState3, s3id] = addState(store, 3);
	const [state4, setState4, s4id] = addState(store, 4);

	// which means the next time i go and setState, it's setting it to
	// the same value as before, which means that 'noChange' is returned,
	// and this component does not re-render

	console.log('RENDER');
	const click = () => {
		store[s2id] = store[s2id] + 1;
	};

	addInit(() => {
		addDependency(store, 'number');
	});

	return html`
		<h1>${state2}</h1>
		<button @click=${click}>Here click</button>
	`;
};

const timer = (data, { addState, addInit, addDependency }) => {
	addInit((_data, instance) => {
		addDependency(store, 'text');
	});

	console.log('rendering text');
	return html`<h1>${store.text}</h1>`;
};

export const num = makeComponent(numRaw);
export default makeComponent(timer);
