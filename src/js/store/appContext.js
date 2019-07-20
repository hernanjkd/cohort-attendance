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
			// Get all students
			const url = "https://api.breatheco.de/user/?access_token=ead2dc2fc5d1c5bcfa48b83ef1b6816034a5d575";
			fetch(url, { cache: "no-cache" })
				.then(response => response.json())
				.then(data => {
					let nullFirst = []; // "null null"
					let allSame = []; // first middle and last all together, all lower or upper case
					let firstLast = []; // first and last in one field, other field empty
					let moreThanTwo = []; // more than 2 names in one field, other empty
					let haveNull = []; // have a null value
					let notCap = []; // not capitalized

					let properName = []; // properly formated name
					let total = []; // total amount of names

					for (let user of data.data) {
						if (user.first_name.includes("null")) nullFirst.push(user);
						let arr = user.first_name.split(" ");
						let lower = 0,
							upper = 0;
						// if (arr.length === 1 && user.last_name === "")
						alert(lower + " - " + upper);
					}
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
