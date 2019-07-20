import React from "react";
import getState from "./flux.js";

export const Context = React.createContext(null);

const injectContext = PassedComponent => {
	class StoreWrapper extends React.Component {
		constructor(props) {
			super(props);

			this.state = getState({
				getStore: () => this.state.store,
				setStore: updatedStore =>
					this.setState({
						store: Object.assign(this.state.store, updatedStore)
					})
			});
		}

		componentDidMount() {
			// Get all students or users
			const get = ["students", "user"];
			const url = `https://api.breatheco.de/${get[0]}/?access_token=ead2dc2fc5d1c5bcfa48b83ef1b6816034a5d575`;
			fetch(url, { cache: "no-cache" })
				.then(response => response.json())
				.then(data => {
					// Solo para q muestre el nombre, asi sale en el console.log pa ver rapido
					data.data = data.data.map(e => {
						return { first_name: e.first_name, last_name: e.last_name, full_name: e.full_name };
					});

					let firstNullNull = []; // "null null"
					let togetherAllLowerOrUpper = []; // first middle and last all together, all lower or upper case
					let firstLastOneField = []; // first and last in one field, other field empty
					let moreThanTwoOneField = []; // more than 2 names in one field, other empty
					let hasNull = []; // have a null value
					let notCapitalized = []; // not capitalized

					let properName = []; // properly formated name
					let total = 0; // total amount of names

					for (let user of data.data) {
						let needsFormating = 0;

						if (user.first_name === null) {
							needsFormating++;
							hasNull.push(user);
						} else {
							if (user.first_name.includes("null")) {
								firstNullNull.push(user);
								needsFormating++;
							}
							let last = user.last_name;
							if (user.last_name === null) {
								hasNull.push(user);
								last = "";
								needsFormating++;
							}

							let arrFirstName = user.first_name.split(" ");
							let lower = 0,
								upper = 0;
							if (arrFirstName.length === 1 && last === "") {
								for (let char of user.first_name) {
									if (char === char.toUpperCase()) upper++;
									else lower++;
								}
								if ((lower > 0 && upper === 0) || (lower === 0 && upper > 0)) {
									togetherAllLowerOrUpper.push(user);
									needsFormating++;
								}
							}
							if (arrFirstName.length === 2 && last === "") {
								firstLastOneField.push(user);
								needsFormating++;
							}
							if (arrFirstName.length > 2 && last === "") {
								moreThanTwoOneField.push(user);
								needsFormating++;
							}
							let noCapName = 0;
							for (let name of arrFirstName) {
								if (name.charAt(0) !== name.charAt(0).toUpperCase()) noCapName++;
							}
							if (noCapName > 0) {
								notCapitalized.push(user);
								needsFormating++;
							}
							if (needsFormating === 0) properName.push(user);
						}
						total++;
					}
					console.log('first: "null null" = ' + firstNullNull.length);
					console.log(firstNullNull);
					console.log('first: "johndoe" or "JOHNDOE" = ' + togetherAllLowerOrUpper.length);
					console.log(togetherAllLowerOrUpper);
					console.log('first: "John Doe", last: "" = ' + firstLastOneField.length);
					console.log(firstLastOneField);
					console.log(
						'first: "John Joe Doe", last: "" , may contain extra spaces = ' + moreThanTwoOneField.length
					);
					console.log(moreThanTwoOneField);
					console.log("Have a null value = " + hasNull.length);
					console.log(hasNull);
					console.log("Not capitalized = " + notCapitalized.length);
					console.log(notCapitalized);
					console.log("Properly formatted names, may contain extra spaces = " + properName.length);
					console.log(properName);
					console.log("Total names checked = " + total);
				});

			// // Get all cohorts
			// const url = "https://api.breatheco.de/cohorts/?access_token=d0feed2a021a9aee7036cdc56c5bd16bca1c2603";
			// fetch(url, { cache: "no-cache" })
			// 	.then(response => response.json())
			// 	.then(data => {
			// 		this.setState(({ store }) => {
			// 			data.data.sort((a, b) => (new Date(a.kickoff_date) < new Date(b.kickoff_date) ? 1 : -1));
			// 			return { store: { ...store, cohorts: data.data } };
			// 		});
			// 	});

			// // A WAY OF SAVING TO STORE LEAVING THE OLD DATA, CREATES A NEW KEY DATA WITH THE VALUE OF DATA
			// fetch(url)
			// 	.then(response => response.json())
			// 	.then(data => {
			// 		this.setState(state => {
			// 			return { store: { ...state.store, data } };
			// 		});
			// 	});

			// // ANOTHER WAY OF SAVING TO STORE LEAVING THE OLD DATA, CREATES A NEW KEY CALLED COHORTS
			// fetch(url)
			// 	.then(response => response.json())
			// 	.then(data => {
			// 		const store = this.state.store;
			// 		this.setState({ store: { ...store, cohorts: data } });
			// 	});
		}

		render() {
			return (
				<Context.Provider value={this.state}>
					<PassedComponent {...this.props} />
				</Context.Provider>
			);
		}
	}
	return StoreWrapper;
};

export default injectContext;
