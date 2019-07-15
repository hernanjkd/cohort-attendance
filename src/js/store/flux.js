const getState = ({ setStore }) => {
	return {
		store: [],
		actions: {
			getStudentsFromCohort: cohort => {
				const url = `https://api.breatheco.de/students/cohort/${cohort}?access_token=88f458c8d5d9fc67115f9fca939d78aa2a8ed101`;
				fetch(url, { cache: "no-cache" })
					.then(response => response.json())
					.then(data => {
						const students = data.data.map(e => {
							return {
								// id: e.id,
								// // Have all names with the same format
								// name:
								// 	e.first_name.charAt(0).toUpperCase() +
								// 	e.first_name.toLowerCase().slice(1) +
								// 	" " +
								// 	e.last_name.charAt(0).toUpperCase() +
								// 	e.last_name.toLowerCase().slice(1),
								data: e,
								name: "machu"
							};
						});
						setStore({ students: students });
					});
			}
		}
	};
};

export default getState;
