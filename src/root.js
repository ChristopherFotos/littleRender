import { html } from 'lit';
import { makeComponent } from './littleRender';
import { store } from './app.js';
import { v4 as uuid } from 'uuid';

const numRaw = (data) => {
	console.log('rendering number');
	return html`<h1>${store.number}</h1>`;
};

numRaw.initializer = (_data, instance) => {
	instance.addDependency(store, 'number');
	console.log('NUM init', instance);
};

export const num = makeComponent(numRaw);
console.log('NUM RETURN VAL:', num);

const timer = (data) => {
	console.log('rendering text');
	return html`<h1>${store.text}</h1>`;
};

timer.initializer = (_data, instance) => {
	instance.addDependency(store, 'text');
	console.log('TEXT init', instance);
};

export default makeComponent(timer);
