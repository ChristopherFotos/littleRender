import { render } from 'lit-html';
import { Directive, directive } from 'lit-html/directive.js';
import { noChange } from 'lit';
import copyObject from 'lodash/_copyObject';
import copyArray from 'lodash/_copyArray';

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

			// Run the component function to do the initial setup, call hooks etc.
			component();

			this.part = partInfo;
			this.component = component;
			this.dependencies = [];

			// At the start of a components lifecycle, the current property
			// will be a function that calls the component's initializer, if
			// it has one. After calling the initializer and returning a
			// renderable  value, it will set this.current to this.subsequent
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

			// the function that runs on all renders after the first one.
			// just returns the component's rendered markup.
			this.subsequent = (data, { initialValues, _self }) => {
				return this.component(data, {
					initialValues: initialValues,
					_self: _self,
				});
			};
			this.renders = 0;
		}

		addState() {}

		addDependency(store, key) {
			// Holds the current value of the dependency being added. Will
			// be compared to the current value on subsequent renders to
			// determine whether the component should re-render or not.
			let lastKnownValue;

			// If the dependency is an object or an array, store a copy of
			// it in lastKNownValue. If it's a primitive, just store the value.
			if (Array.isArray(store[key])) {
				lastKnownValue = copyArray(store[key]);
			} else if (
				typeof store[key] === 'object' &&
				!Array.isArray(store[key]) &&
				store[key] !== null
			) {
				lastKnownValue = copyObject(store[key]);
			} else {
				lastKnownValue = store[key];
			}

			// The dependency object will contain the store and key needed
			// to access it, as well as the dependency's last know value.
			const dependency = {
				store,
				key,
				lastKnownValue,
			};

			this.dependencies.push(dependency);
		}

		shouldUpdate() {
			// Caching the array length for performance.
			const depLength = this.dependencies.length;

			// Using a for loop for performance
			for (let i = 0; i < depLength; i++) {
				let dep = this.dependencies[i];

				// store the current and last known value in an object for
				// comparison
				const compare = {
					current: dep.store[dep.key],
					lastKnown: dep.lastKnownValue,
				};

				// Is it different?
				const isDifferent = !(compare.lastKnown === compare.current);

				// If it is, update the last known value and return true to
				// signal that the component should be re-rendered.
				if (isDifferent) {
					dep.lastKnownValue = compare.current;
					return true;
				}
			}

			// If no differences are found, return false to signal that the
			// component does not need to re-render.
			return false;
		}

		render(data) {
			this.renders++;

			// Check if the component needs to update
			let willUpdate = this.shouldUpdate();

			if (this.renders > 1 && !willUpdate) return noChange;
			if (!this.component) this.component = component;

			// Return renderable markup
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
