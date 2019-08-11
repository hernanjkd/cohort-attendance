import React from "react";
import getState from "./flux.js";

export const Context = React.createContext(null);

const injectContext = PassedComponent => {
	class StoreWrapper extends React.Component {
		constructor(props) {
			super(props);

			this.state = getState({
				getStore: () => this.state.store,
				getActions: func => this.state.actions[func],
				setStore: updatedStore =>
					this.setState({
						store: Object.assign(this.state.store, updatedStore)
					})
			});
		}

		componentDidMount() {
			// Get all cohorts
			const url = `https://api.breatheco.de/cohorts/?access_token=${process.env.ACCESS_TOKEN}`;
			fetch(url, { cache: "no-cache" })
				.then(response => response.json())
				.then(data => {
					this.setState(({ store }) => {
						data.data.sort((a, b) => (new Date(a.kickoff_date) < new Date(b.kickoff_date) ? 1 : -1));
						return { store: { ...store, cohorts: data.data } };
					});
				});
			/********************************************************************* */
			/********************************************************************* */
			/********************************************************************* */
			/********************************************************************* */
			/********************************************************************* */
			// // Get all students or users
			// const access_token = "889b3a2f1e46637807e190bf1e9ad06b335aa23d";
			// const availableEndPoints = ["students", "user"];
			// const get = availableEndPoints[0];
			// const url = `https://api.breatheco.de/${get}/?access_token=${access_token}`;
			// fetch(url, { cache: "no-cache" })
			// 	.then(response => response.json())
			// 	.then(data => {
			// 		// Solo para q muestre el nombre en el array en el console.log, pa ver mas rapido
			// 		let cleanData = data.data.map(e => {
			// 			return {
			// 				first_name: e.first_name,
			// 				last_name: e.last_name,
			// 				email: get === "students" ? e.email : e.username,
			// 				full_name: e.full_name,
			// 				...e
			// 			};
			// 		});
			// 		this.setState({ store: cleanData });
			// 	});
			/********************************************************************* */
			/********************************************************************* */
			/********************************************************************* */
			/********************************************************************* */
			/********************************************************************* */

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
