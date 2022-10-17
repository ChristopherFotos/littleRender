import { render, html } from 'lit';
import { makeComponent } from './littleRender';

const rootComp = (data, init) => {
	return html`<h1>${init || data}</h1>`;
};

rootComp.initializer = () => 'intialized value';

export default makeComponent(rootComp);
