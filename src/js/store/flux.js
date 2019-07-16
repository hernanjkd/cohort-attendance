const getState = ({ setStore }) => {
	return {
		store: [],
		actions: {
			getStudentsFromCohort: cohort => {
				const url = `https://api.breatheco.de/students/cohort/${cohort}?access_token=d0feed2a021a9aee7036cdc56c5bd16bca1c2603`;
				fetch(url, { cache: "no-cache" })
					.then(response => response.json())
					.then(data => {
						const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

						let students = data.data.map(e => {
							//
							// first_name: "null null", last_name: ""
							if (e.first_name.includes("null") && e.last_name == "") return { ...e, name: e.email };

							// first_name: "JohnDoe", last_name: null
							let newName = "";
							if (!e.first_name.includes(" ") && e.last_name == null)
								for (let char of e.first_name)
									newName += char == char.toUpperCase() ? " " + char : char;
							else {
								// first_name: "John doe", last_name: null
								// first_name: "john JIMMY", last_name: "JOE Doe"
								let nameArr = e.first_name.split(" ");
								if (e.last_name != null) nameArr = nameArr.concat(e.last_name.split(" "));

								for (let name of nameArr) newName += " " + capitalize(name);
							}
							return { ...e, name: newName.slice(1) };
						});
						setStore({ students: students });
					});
			}
		}
	};
};

export default getState;
