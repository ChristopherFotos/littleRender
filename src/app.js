import './style.scss';
import { render, html, noChange } from 'lit';
import { makeStore, initializers, renderDirective } from './littleRender';
import { Directive, directive } from 'lit-html/directive.js';
import { wrapComponent } from './makeComponentDirective';
import { v4 as uuid } from 'uuid';
import root from './root';

let click = 0;

const reRender = () => {
	click++;
	render(parent(), document.body);
};

const parent = () => {
	const ifClick = () => {
		if (click > 3) return root(27);
	};

	return html`<div>
		${root(24)} ${ifClick()}

		<button @click=${reRender}>click</button>
	</div>`;
};

console.log(render(parent(), document.body));
