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
			const url = "https://assets.breatheco.de/apis/activity/user/martinprospers1@gmail.com";
			fetch(url)
				.then(response => response.json())
				.then(data => {
					data.log.map(e => {
						// Creates the "day" key for the incoming data
						e.day = e.data ? JSON.parse(e.data).day : null;
						// Sets the "created date" in Date format
						e.created_at.date = new Date(e.created_at.date);
					});
					// Sort data by "created date"
					data.log.sort((a, b) => (a.created_at.date > b.created_at.date ? 1 : -1));
					this.setState({ store: data });
				});
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
