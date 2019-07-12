import React from "react";
import getState from "./flux.js";

// Don't change, here is where we initialize our context, by default its just going to be Null.
export const Context = React.createContext(null);

// This function injects the global store to any view/component where you want to use it, we will inject the context to Layout.jsx, you can see it here:
// https://github.com/4GeeksAcademy/react-hello-webapp/blob/master/src/js/layout.jsx#L35
const injectContext = PassedComponent => {
	class StoreWrapper extends React.Component {
		constructor(props) {
			super(props);

			//this will be passed as the contenxt value
			this.state = getState({
				getStore: () => this.state.store,
				setStore: updatedStore =>
					this.setState({
						store: Object.assign(this.state.store, updatedStore)
					})
			});
		}

		componentDidMount() {
			// All students in cohort
			// const url =
			// 	"https://api.breatheco.de/students/cohort/downtown-ft-iii?access_token=bdba9802085fbb134d7dafbc76f0f1d53808f294";
			// fetch(url, { cache: "no-cache" }).then(response => alert());

			// All cohorts
			const url = "https://api.breatheco.de/cohorts/?access_token=bdba9802085fbb134d7dafbc76f0f1d53808f294";
			fetch(url, { cache: "no-cache" })
				.then(response => response.json())
				.then(data => {
					this.setState(({ store }) => {
						let cohorts = data.data.map(e => {
							return { slug: e.slug, name: e.name };
						});
						cohorts.reverse();
						return { store: { ...store, cohorts } };
					});
				});

			// // A WAY OF SAVING TO STORE LEAVING THE OLD DATA
			// fetch(url)
			// 	.then(response => response.json())
			// 	.then(data => {
			// 		this.setState(state => {
			// 			return {store: {...state.store, data} }
			// 		});
			// 	});

			// // ANOTHER WAY OF SAVING TO STORE LEAVING THE OLD DATA
			// fetch(url)
			// 	.then(response => response.json())
			// 	.then(data => {
			// 		const store = this.state.store;
			// 		this.setState({store: {...store, data} });
			// 	});

			// Single student activity
			// const url =
			// 	"https://assets.breatheco.de/apis/activity/user/hernanjkd@gmail.com?access_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjbGllbnRJZCI6NTUzLCJpYXQiOjE1NjI3OTg1NjYsImV4cCI6MzMxMTk3NTA1NjZ9.tgDRDOrDCNysOYmgMNI3p5caoeAU-e--jhGB3XieVWQ";
			// fetch(url)
			// 	.then(response => response.json())
			// 	.then(data => {
			// 		data.log.map(e => {
			// 			// Creates the "day" key for the incoming data
			// 			e.day = e.data ? JSON.parse(e.data).day : null;
			// 			// Sets the "created date" in Date format
			// 			e.created_at.date = new Date(e.created_at.date);
			// 		});
			// 		// Sort data by "created date"
			// 		data.log.sort((a, b) => (a.created_at.date > b.created_at.date ? 1 : -1));
			// 		this.setState({ store: data });
			// 	});
		}

		render() {
			// the initial value for the context its not null anymore, but the current state of this component,
			// the context will have a getStore and setStore functions available then, because they were declared
			// on the state of this component
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
