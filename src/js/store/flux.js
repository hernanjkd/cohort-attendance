const getState = ({ getStore, setStore }) => {
	return {
		store: [],
		actions: {
			getStudentsFromCohort: cohort => {
				const url = `https://api.breatheco.de/students/cohort/${cohort}?access_token=88f458c8d5d9fc67115f9fca939d78aa2a8ed101`;
				fetch(url, { cache: "no-cache" })
					.then(response => response.json())
					.then(data => {
						setStore({ students: data });
					});
			}
		}
	};
};

export default getState;
