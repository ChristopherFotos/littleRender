import { render, html } from 'lit';
import makeComponentDirective from './makeComponentDirective';

export const rootComp = (data, init) => {
	return html`<h1>${init || data}</h1>`;
};

rootComp.initializer = () => 'intialized value';

export default makeComponentDirective(rootComp);
