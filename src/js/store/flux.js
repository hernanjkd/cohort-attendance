const getState = ({ getStore, setStore }) => {
	return {
		store: [],
		actions: {
			getStudentsFromCohort: cohort => {
				const url = `https://api.breatheco.de/students/cohort/${cohort}?access_token=bdba9802085fbb134d7dafbc76f0f1d53808f294`;
				fetch(url, { cache: "no-cache" })
					.then(response => response.json())
					.then(data =>
						setStore(({ store }) => {
							return { store: { ...store, data } };
						})
					);
			}
		}
	};
};

export default getState;
