const initializers = {
	initialize() {
		for (const key in this) {
			if (key !== 'initialize') this[key]();
		}
	},
};

export default initializers;
