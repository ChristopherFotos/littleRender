import { html } from 'lit-html';
import { store } from './app.js';

const handleClick = () => {
	console.log('click');
	store.text = `${Math.floor(Math.random() * 100)} gay guys`;
};

const btn = (data) => html`<button @click=${handleClick}>${data}</button>`;

export default btn;
