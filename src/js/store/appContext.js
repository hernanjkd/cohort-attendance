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
			const access_token = "40424c3c354897532d182ae1110a02eee2427558";
			const availableEndPoints = ["students", "user"];

			const get = availableEndPoints[0];
			const url = `https://api.breatheco.de/${get}/?access_token=${access_token}`;
			fetch(url, { cache: "no-cache" })
				.then(response => response.json())
				.then(data => {
					// Solo para q muestre el nombre, asi sale en el console.log pa ver rapido
					data.data = data.data.map(e => {
						// Take out all extra spaces
						// let n = e.first_name.trim();
						// let temp = "";
						// for (let i in n) if (n[i] !== " " || n[i - 1] !== " ") temp += n[i];
						// e.first_name = temp;
						// Only return fields interested in, for easier visualization

						const fullTrim = str => {
							let newStr = "";
							str = str.trim();
							for (let i in str) if (str[i] !== " " || str[i - 1] !== " ") newStr += str[i];
							return newStr;
						};
						let first = e.first_name;
						let last = e.last_name;
						if (last === null) last = "";

						// first_name: null
						// first_name: "null null"
						if (first === null || first.includes("null")) {
							if (e.email !== undefined) first = e.email.substring(0, e.email.indexOf("@"));
							else if (e.username !== undefined) first = e.username.substring(0, e.username.indexOf("@"));
						} else {
							first = fullTrim(first);
							last = fullTrim(last);

							let arr = first.split(" ");
							// first_name: "JohnDoe"
							// first_name: "JOHNDOE"
							if (arr.length == 1) {
								if (first !== first.toLowerCase() && first !== first.toUpperCase()) {
									let temp = "";
									for (let char of first) {
										if (char == char.toUpperCase()) temp += " " + char;
										else temp += char;
									}
									first = temp.trim();
								}
							}
						}

						e.first_name = first;
						e.last_name = last;

						let email = get === "students" ? e.email : e.username;
						return {
							first_name: e.first_name,
							last_name: e.last_name,
							full_name: e.full_name,
							email: email
						};
					});

					let firstNullNull = []; // "null null"
					let togetherAllLowerOrUpper = []; // first middle and last all together, all lower or upper case
					let firstLastOneField = []; // first and last in one field, other field empty
					let moreThanTwoOneField = []; // more than 2 names in one field, other empty
					let hasNull = []; // have a null value
					let notCapitalized = []; // not capitalized
					let emptyEmail = [];

					let properName = []; // properly formated name
					let total = 0; // total amount of names

					for (let user of data.data) {
						let needsFormating = 0;

						if (!user.email.includes("@")) emptyEmail.push(user);

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
							// if (
							// 	arrFirstName.length === 1 &&
							// 	last === "" &&
							// 	(user.first_name === user.first_name.toLowerCase() ||
							// 		user.first_name === user.first_name.toUpperCase())
							// ) {
							// 	togetherAllLowerOrUpper.push(user);
							// 	needsFormating++;
							// }
							if (arrFirstName.length === 1 && last === "") togetherAllLowerOrUpper.push(user);
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
								if (
									name.charAt(0) !== name.charAt(0).toUpperCase() ||
									name.charAt(2) !== name.charAt(2).toLowerCase()
								)
									noCapName++;
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
					console.log("Emails that don't have '@' = " + emptyEmail.length);
					console.log(emptyEmail);
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
