import { render } from 'lit-html';
import { Directive, directive } from 'lit-html/directive.js';

/* add a hooks array to each value, and then use a getter 
trap to return the value when the property is accessed. 
in the setter trap, execute every state change hook. maybe also add
access hooks.*/

export const makeStore = (root, rootElement, data) => {
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

export const makeComponent = (component) => {
	class ComponentDirective extends Directive {
		constructor(partInfo) {
			super(partInfo);
			this.part = partInfo;
			this.component = component;

			this.subsequent = (data, initValues) => {
				return this.component(data, initValues);
			};

			this.current = (data) => {
				let initValues;
				if (this.component.initializer) {
					initValues = this.component.initializer();
				}

				this.initValues = initValues;

				const rendered = this.component(data, initValues);

				this.current = this.subsequent;

				return rendered;
			};

			this.renders = 0;
		}

		render(data) {
			this.renders++;
			if (!this.component) this.component = component;

			return this.current(data, this.initValues);
		}
	}

	return directive(ComponentDirective);
};
