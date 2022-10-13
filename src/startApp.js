import { render } from 'lit-html';

export default function startApp(rootComponent, rootElement, initialState) {
	const rerender = () => {
		render(rootComponent(initialState), rootElement);
	};

	rerender();

	intializers.initialize();

	return rerender;
}
