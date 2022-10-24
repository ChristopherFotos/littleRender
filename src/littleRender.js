import { render } from 'lit-html';
import { Directive, directive } from 'lit-html/directive.js';
import { noChange } from 'lit';
import cloneDeep from 'lodash/cloneDeep';
import { uniqueId } from 'lodash';

/* add a hooks array to each value, and then use a getter 
trap to return the value when the property is accessed. 
in the setter trap, execute every state change hook. maybe also add
access hooks.*/

export const makeStore = (root, rootElement, data) => {
	const store = cloneDeep(data);
	store.root = root;

	const handler = {
		set(target, prop, value) {
			if (prop === 'root') {
				target.root = value;
				return true;
			}

			if (prop.startsWith('NO_RENDER') && !target.hasOwnProperty(prop)) {
				console.log('preventing re-render');
				target[prop] = value;
				return true;
			}

			console.log('re-rendering proxy', prop);

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
			this.localState = [];
			this.localStatePointer = 0;

			// At the start of a components lifecycle, the current property
			// will be a function that calls the component's initializer, if
			// it has one. After calling the initializer and returning a
			// renderable  value, it will set this.current to this.subsequent
			this.current = (data) => {
				let initValues;

				if (this.component.initializer) {
					initValues = this.component.initializer();
				}

				this.initValues = initValues;

				const rendered = this.component(data, this.generateApi(this));

				this.current = this.subsequent;

				return rendered;
			};

			// the function that runs on all renders after the first one.
			// just returns the component's rendered markup.
			this.subsequent = (data) => {
				return this.component(data, this.generateApi(this));
			};
			this.renders = 0;

			// Run the component function to do the initial setup, call hooks etc.
			// console.log(this.generateApi());
			// component(this.generateApi);
		}

		addState = (store, state) => {
			console.log('addstate');
			// debugger;
			if (this.renders === 0) {
				const key = `NO_RENDER-${uniqueId()}`;

				store[key] = state;
				this.addDependency(store, key);

				const returnVal = [
					store[key],

					(value) => {
						console.log('PARAM: ', value);
						// this.localState[this.localStatePointer][0] = value;
						// console.log('TARGET: ', this.localState[this.localStatePointer][0]);
						store[key] = value;
						console.log('val ', store[key]);
						return store[key];
					},
				];

				returnVal.push(key);

				this.localState.push(returnVal);

				return returnVal;
			} else if (
				this.renders > 0 &&
				this.localStatePointer <= this.localState.length - 1
			) {
				const returnVal = this.localState[this.localStatePointer];

				// Manually syncing the localState with the store. this is BAD,
				// we need a single source of trueth that we can subscribe to
				returnVal[0] = store[returnVal[2]];

				this.localStatePointer += 1;
				return returnVal;
			} else {
				this.localStatePointer = 0;
				const returnVal = this.localState[this.localStatePointer];

				// Manually syncing the localState with the store. this is BAD,
				// we need a single source of trueth that we can subscribe to
				returnVal[0] = store[returnVal[2]];

				this.localStatePointer += 1;
				return returnVal;
			}
		};

		addInit = (initializer) => {
			this.component.initializer = initializer;
		};

		addDependency = (store, key) => {
			// Holds the current value of the dependency being added. Will
			// be compared to the current value on subsequent renders to
			// determine whether the component should re-render or not.
			let lastKnownValue;

			// If the dependency is an object or an array, store a copy of
			// it in lastKNownValue. If it's a primitive, just store the value.
			if (Array.isArray(store[key])) {
				lastKnownValue = cloneDeep(store[key]);
			} else if (
				typeof store[key] === 'object' &&
				!Array.isArray(store[key]) &&
				store[key] !== null
			) {
				lastKnownValue = cloneDeep(store[key]);
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
		};

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

		generateApi(self) {
			return {
				initialValues: self.initValues,
				addState: self.addState,
				addInit: self.addInit,
				addDependency: self.addDependency,
				_self: self,
			};
		}

		render(data) {
			if (this.renders < 1) {
				this.component(data, this.generateApi(this));
			}
			this.renders++;

			// Check if the component needs to update
			let willUpdate = this.shouldUpdate();
			console.log('SHOULD UPDATE? ', willUpdate);

			if (this.renders > 1 && !willUpdate) return noChange;
			if (!this.component) this.component = component;

			// Return renderable markup
			return this.current(data);
		}
	}

	return directive(ComponentDirective);
};
