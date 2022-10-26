import { html } from 'lit';
import { makeComponent } from './littleRender';
import { store } from './app.js';

// idea for updating in response to props changes:
// store a 'current data' property in the class. in
// should Update, check if the data recieved this
// time is different from last time. if so, re-render

const numRaw = (data, { addState, addInit, addDependency, _self }) => {
	const [state, setState, s1id] = addState(store, 1);
	const [state2, setState2, s2id] = addState(store, 2);
	const [state3, setState3, s3id] = addState(store, 3);
	const [state4, setState4, s4id] = addState(store, 4);

	const click = () => {
		setState2(state2 + 1);
	};

	addInit(() => {
		addDependency(store, 'number');
		addDependency(store, 'text');
	});

	return html`
		<h1>${state2}</h1>
		<h1>${store.number}</h1>
		<button @click=${click}>Here click</button>
		${makeComponent(timer)()}
	`;
};

const timer = (data, { addState, addInit, addDependency }) => {
	addInit((_data, instance) => {
		addDependency(store, 'text');
	});

	return html`<h1>${store.text}</h1>`;
};

export const num = makeComponent(numRaw);
export default makeComponent(timer);
