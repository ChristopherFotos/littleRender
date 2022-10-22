import { render } from 'lit-html';
import { Directive, directive } from 'lit-html/directive.js';
import { guard } from 'lit/directives/guard.js';
import { v4 as uuid } from 'uuid';
import { noChange } from 'lit';

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
			this.dependencies = [];

			this.subsequent = (data, { initialValues, _self }) => {
				return this.component(data, {
					initialValues: initialValues,
					_self: _self,
				});
			};

			this.current = (data, { _self, initialValues }) => {
				let initValues;
				if (this.component.initializer) {
					initValues = this.component.initializer(data, _self);
				}

				this.initValues = initValues;

				const rendered = this.component(data, {
					initialValues: initValues,
					_self: _self,
				});

				this.current = this.subsequent;

				return rendered;
			};

			this.renders = 0;
		}

		addDependency(store, key) {
			console.log('Adding dependency: ', store, key, store[key]);
			let lastKnownValue;

			if (Array.isArray(store[key])) {
				lastKnownValue = [...store[key]];
			} else if (
				typeof store[key] === 'object' &&
				!Array.isArray(store[key]) &&
				store[key] !== null
			) {
				lastKnownValue = { ...store[key] };
			} else {
				lastKnownValue = store[key];
			}

			const dependency = {
				store,
				key,
				lastKnownValue,
			};

			this.dependencies.push(dependency);
		}

		shouldUpdate() {
			const depLength = this.dependencies.length;

			for (let i = 0; i < depLength; i++) {
				let dep = this.dependencies[i];

				const compare = {
					current: dep.store[dep.key],
					lastKnown: dep.lastKnownValue,
				};

				const isDifferent = !(compare.lastKnown === compare.current);

				if (isDifferent) {
					dep.lastKnownValue = compare.current;
					return true;
				}
			}

			return false;
		}

		render(data) {
			this.renders++;
			let willUpdate = this.shouldUpdate();

			if (this.renders > 1 && !willUpdate) return noChange;
			if (!this.component) this.component = component;

			return this.current(data, {
				/*
				This object can be used as the API for this object. Feed methods and properties
			  from this class into this object, and the user can destructure whichever pieces 
				they want. 
				*/
				initialValues: this.initValues,
				_self: this,
			});
		}
	}

	return directive(ComponentDirective);
};
