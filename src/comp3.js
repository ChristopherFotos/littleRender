import { html } from 'lit-html';
import store from './spark.js';
import indicator from './indicator.js';

const handleChange = (e) => {
	store.booty = e.target.value;
};

const handleBtnClick = () => {
	store.list = [...store.list, store.booty];
	store.booty = '';
};

const comp3 = (data) =>
	html`<input @input=${handleChange} .value=${data} />
		<button @click=${handleBtnClick}>pushy</button>
		<ul></ul>
		${indicator()} `;

export default comp3;
