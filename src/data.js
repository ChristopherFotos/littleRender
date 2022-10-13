import { render } from 'lit-html';

/* add a hooks array to each value, and then use a getter 
trap to return the value when the property is accessed. 
in the setter trap, execute every state change hook. maybe also add
access hooks. 

*/

const makeStore = (root, rootElement, data) => {
	const store = {
		...data,
		root,
	};

	const handler = {
		set(target, prop, value) {
			if (prop === 'root') {
				target.root = value;
				return true;
			}
			target[prop] = value;
			render(target.root(target), rootElement);
			return true;
		},
	};

	return new Proxy(store, handler);
};

export default makeStore;
