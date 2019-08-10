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
			const access_token = "11f04023c945a68b5021dd70e7519684230f1d07";
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
						const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
						const getUserName = email => email.substring(0, email.indexOf("@")).toLowerCase();
						const fullTrim = str => {
							let newStr = "";
							str = str.trim();
							for (let i in str) if (str[i] !== " " || str[i - 1] !== " ") newStr += str[i];
							return newStr;
						};
						let first = e.first_name;
						let last = e.last_name;
						if (last === null) last = "";
						// In the fetch url, Students have email, Users have username
						let username = e.username === undefined ? getUserName(e.email) : getUserName(e.username);

						// first_name: null
						// first_name: "null null"
						if (first === null || first.includes("null")) {
							first = username;
						}
						// first === email username, keep lowercase
						else if (first.toLowerCase() === username) {
							first = username;
						} else {
							first = fullTrim(first);
							last = fullTrim(last);

							let arr = first.split(" ");
							// first_name: "John"
							// first_name: "JohnDoe"
							// first_name: "JOHNDOE"
							if (arr.length === 1) {
								if (first !== first.toLowerCase() && first !== first.toUpperCase()) {
									let temp = "";
									for (let char of first) {
										if (char === char.toUpperCase() && isNaN(char)) temp += " " + char;
										else temp += char;
									}
									first = temp.trim();
									arr = first.split(" ");
									if (arr.length === 1) first = capitalize(arr[0]);
								} else first = capitalize(first);
							}
							// first_name: "john doe", last_name: ""
							if (arr.length === 2 && last === "") {
								first = capitalize(arr[0]);
								last = capitalize(arr[1]);
							}
							// first_name: "john joe doe", last_name: ""
							else if (arr.length === 3 && last === "") {
								// first = capitalize(arr[0]) + " " + capitalize(arr[1]);
								// last = capitalize(arr[2]);
							}
							// first_name: "john billy", last_name: "joe doe"
							else if (last !== "") {
								let arrl = last.split(" ");
								for (let i in arr) arr[i] = capitalize(arr[i]);
								for (let i in arrl) arrl[i] = capitalize(arrl[i]);
								first = arr.join(" ");
								last = arrl.join(" ");
							}
						}
						console.log(`"${e.first_name}, ${e.last_name}" - ${e.email}`);
						console.log(`"${first}, ${last}"`);
						console.log("");
						e.first_name = first;
						e.last_name = last;
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
			// 	.then(cohorts => {
			// 		this.setState(state => {
			// 			return { store: { ...state.store, cohorts } };
			// 		});
			// 	});

			// // ANOTHER WAY OF SAVING TO STORE LEAVING THE OLD DATA, CREATES A NEW KEY CALLED COHORTS
			// fetch(url)
			// 	.then(response => response.json())
			// 	.then(data => {
			// 		this.setState({ store: { ...this.state.store, cohorts: data } });
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
