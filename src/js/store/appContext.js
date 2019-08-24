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
						console.log(data.data);
						data.data.sort((a, b) => (new Date(a.kickoff_date) < new Date(b.kickoff_date) ? 1 : -1));
						return { store: { ...store, cohorts: data.data } };
					});
				});

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
