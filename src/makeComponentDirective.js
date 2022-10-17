import { Directive, directive } from 'lit-html/directive.js';

const makeComponentDirective = (component) => {
	class ComponentDirective extends Directive {
		constructor(partInfo) {
			super(partInfo);
			this.part = partInfo;
			this.component = component;

			this.subsequent = (data) => {
				console.log('CALLING SUBSEQUENT');
				return this.component(data);
			};

			this.current = (data) => {
				console.log('CALLING INITIAL');

				const initValues = this.component.initializer();
				const rendered = this.component(data, initValues);

				this.current = this.subsequent;

				return rendered;
			};

			this.renders = 0;
		}

		render(data) {
			this.renders++;
			if (!this.component) this.component = component;

			return this.current(data);
		}
	}

	return directive(ComponentDirective);
};

export default makeComponentDirective;
