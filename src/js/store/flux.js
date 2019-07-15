const getState = ({ setStore }) => {
	return {
		store: [],
		actions: {
			getStudentsFromCohort: cohort => {
				const url = `https://api.breatheco.de/students/cohort/${cohort}?access_token=d0feed2a021a9aee7036cdc56c5bd16bca1c2603`;
				fetch(url, { cache: "no-cache" })
					.then(response => response.json())
					.then(data => {
						let students = data.data.filter(
							e =>
								(!e.first_name.length && !e.last_name.length) ||
								!e.last_namee.first_name.includes("null")
						);
						students = data.data.map(e => {
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
