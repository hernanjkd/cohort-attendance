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
			const access_token = "42ebf0ca4ad7d20eb340027343680d25ad6c2c26";
			const availableEndPoints = ["students", "user"];

			const get = availableEndPoints[0];
			const url = `https://api.breatheco.de/${get}/?access_token=${access_token}`;
			fetch(url, { cache: "no-cache" })
				.then(response => response.json())
				.then(data => {
					// Solo para q muestre el nombre en el array en el console.log, pa ver mas rapido
					data.data = data.data.map(e => {
						/**************************************************************** */
						/**************************************************************** */
						/**************************************************************** */
						// const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
						// const getUserName = email => email.substring(0, email.indexOf("@")).toLowerCase();
						// const fullTrim = str => {
						// 	let newStr = "";
						// 	str = str.trim();
						// 	for (let i in str) if (str[i] !== " " || str[i - 1] !== " ") newStr += str[i];
						// 	return newStr;
						// };
						// let first = e.first_name;
						// let last = e.last_name;
						// if (last === null) last = "";
						// // In the fetch url, Students have email, Users have username
						// let username = e.username === undefined ? getUserName(e.email) : getUserName(e.username);

						// // first_name: null
						// // first_name: "null null"
						// if (first === null || first.includes("null")) {
						// 	first = username;
						// }
						// // first === email username, keep lowercase
						// else if (first.toLowerCase() === username) {
						// 	first = username;
						// } else {
						// 	first = fullTrim(first);
						// 	last = fullTrim(last);

						// 	let arr = first.split(" ");
						// 	// first_name: "John"
						// 	// first_name: "JohnDoe"
						// 	// first_name: "JOHNDOE"
						// 	if (arr.length === 1) {
						// 		if (first !== first.toLowerCase() && first !== first.toUpperCase()) {
						// 			let temp = "";
						// 			for (let char of first) {
						// 				if (char === char.toUpperCase() && isNaN(char)) temp += " " + char;
						// 				else temp += char;
						// 			}
						// 			first = temp.trim();
						// 			arr = first.split(" ");
						// 			if (arr.length === 1) first = capitalize(arr[0]);
						// 		} else first = capitalize(first);
						// 	}
						// 	// first_name: "john doe", last_name: ""
						// 	if (arr.length === 2 && last === "") {
						// 		first = capitalize(arr[0]);
						// 		last = capitalize(arr[1]);
						// 	}
						// 	// first_name: "john joe doe", last_name: ""
						// 	else if (arr.length === 3 && last === "") {
						// 		// first = capitalize(arr[0]) + " " + capitalize(arr[1]);
						// 		// last = capitalize(arr[2]);
						// 	}
						// 	// first_name: "john billy", last_name: "joe doe"
						// 	else if (last !== "") {
						// 		let arrl = last.split(" ");
						// 		for (let i in arr) arr[i] = capitalize(arr[i]);
						// 		for (let i in arrl) arrl[i] = capitalize(arrl[i]);
						// 		first = arr.join(" ");
						// 		last = arrl.join(" ");
						// 	}
						// }

						// e.first_name = first;
						// e.last_name = last;
						/**************************************************************** */
						/**************************************************************** */
						/**************************************************************** */

						return {
							first_name: e.first_name,
							last_name: e.last_name,
							email: get === "students" ? e.email : e.username,
							full_name: e.full_name,
							...e
						};
					});

					const fullTrim = str => {
						let newStr = "";
						str = str.trim();
						for (let i in str) if (str[i] !== " " || str[i - 1] !== " ") newStr += str[i];
						return newStr;
					};

					let firstNullNull = []; // "null null"
					let allLowerOrUpper = []; // first middle and last all together, all lower or upper case
					let firstLastOneField = []; // first and last in one field, other field empty
					let moreThanTwoOneField = []; // more than 2 names in one field, other empty
					let hasNull = []; // have a null value
					let notCapitalized = []; // not capitalized
					let manyEmptySpaces = [];
					let emptyEmail = [];

					let noFormatting = []; // properly formated name
					let total = 0; // total amount of names

					for (let user of data.data) {
						// In the fetch url: Students have email, Users have username
						let email = user.username === undefined ? user.email : user.username;

						let needsFormating = 0;
						// Check email has @
						if (!email.includes("@")) emptyEmail.push(user);

						// first is null
						if (user.first_name === null) {
							needsFormating++;
							hasNull.push(user);
						} else {
							// first is "null null"
							if (user.first_name.includes("null")) {
								firstNullNull.push(user);
								needsFormating++;
							}
							let last = user.last_name;
							// last is null
							if (user.last_name === null) {
								hasNull.push(user);
								// Set all null last names to ""
								last = "";
								needsFormating++;
							}
							// many empty spaces
							let emptySpaces = user.first_name.split(" ").length;
							let first = fullTrim(user.first_name);
							let arrFirstName = first.split(" ");
							if (emptySpaces > arrFirstName.length) {
								manyEmptySpaces.push(user);
								needsFormating++;
							}

							// All names equal to user name keep lower case and don't consider for formatting
							if (first !== email.substring(0, email.indexOf("@")).toLowerCase()) {
								// Any name not capitalized
								for (let name of arrFirstName.concat(last.split(" "))) {
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

								let noCapName = 0;
								// first name is all lowercase or uppercase, last = ""
								if (
									arrFirstName.length === 1 &&
									last === "" &&
									(user.first_name === user.first_name.toLowerCase() ||
										user.first_name === user.first_name.toUpperCase())
								) {
									allLowerOrUpper.push(user);
									needsFormating++;
								}
							}
							// first and last in one field, last = ""
							if (arrFirstName.length === 2 && last === "") {
								firstLastOneField.push(user);
								needsFormating++;
							}
							// More than 2 names in one field, last = ""
							if (arrFirstName.length > 2 && last === "") {
								moreThanTwoOneField.push(user);
								needsFormating++;
							}
							// Names that don't need formatting
							if (needsFormating === 0) noFormatting.push(user);
						}
						total++;
					}
					console.log(firstNullNull);
					console.log('first name: "null null" = ' + firstNullNull.length);
					console.log(manyEmptySpaces);
					console.log("Many empty spaces = " + manyEmptySpaces.length);
					console.log(allLowerOrUpper);
					console.log("All lowercase or uppercase, no last name = " + allLowerOrUpper.length);
					console.log(firstLastOneField);
					console.log('first name: "John Doe", no last name = ' + firstLastOneField.length);
					console.log(moreThanTwoOneField);
					console.log('first name: "John Joe Doe", no last name = ' + moreThanTwoOneField.length);
					console.log(hasNull);
					console.log("Have a null value = " + hasNull.length);
					console.log(notCapitalized);
					console.log("Not capitalized = " + notCapitalized.length);
					console.log(noFormatting);
					console.log("Names that don't need formatting = " + noFormatting.length);
					console.log(emptyEmail);
					console.log("Emails that don't have '@' = " + emptyEmail.length);
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
