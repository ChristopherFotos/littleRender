import './style.scss';
import { render, html } from 'lit';
import { makeStore } from './littleRender';
import root, { num } from './root';
import comp3 from './comp3';

const changeText = () => {
	store.text = store.text + ' BANG!';
};
const changeNumber = () => {
	store.number = store.number + 1;
};

const parent = () => {
	return html`
		<button @click=${changeText}>Change Text</button>
		<button @click=${changeNumber}>Change Number</button>
		<div>${root()}</div>
		<div>${num()}</div>
		<div>${comp3()}</div>
	`;
};

export const store = makeStore(parent, document.body, {
	text: 'shalom',
	number: 0,
});

render(parent(), document.body);
