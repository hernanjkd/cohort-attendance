const getState = ({ setStore }) => {
	return {
		store: [],
		actions: {
			getStudentsFromCohort: cohort => {
				const url = `https://api.breatheco.de/students/cohort/${cohort}?access_token=d0feed2a021a9aee7036cdc56c5bd16bca1c2603`;
				fetch(url, { cache: "no-cache" })
					.then(response => response.json())
					.then(data => {
						let students = data.data.map(e => {
							// first_name: "null null", last_name: ""
							if (e.first_name.includes("null") && String(e.last_name).length == 0)
								return { ...e, first_name: e.email };

							// first_name: "John Doe", last_name: ""
							let nameArr = e.first_name.split(" ");
							if (nameArr.length == 2 && String(e.last_name).length == 0)
								return { ...e, first_name: nameArr[0], last_name: nameArr[1] };
						});
						setStore({ students: students });
					});
			}
		}
	};
};

export default getState;
