import { html } from 'lit';
import { makeComponent } from './littleRender';
import { store } from './app.js';
import root from './root';

const comp3 = (data, { addInit, addDependency }) => {
	addInit(() => {
		addDependency(store, 'text');
	});

	return html` ${root()} `;
};

export default makeComponent(comp3);
