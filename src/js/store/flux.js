const access_token = "2e3dc3bb5f68a741428d05649a6259cedd91031f";
const assets_token =
	"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjbGllbnRJZCI6NTUzLCJpYXQiOjE1NjMzNzYyMzAsImV4cCI6MzMxMjAzMjgyMzB9.KxzKdgSl3gXRAdpIbWzGFzsfJd86yOPbUWgoqf-ruD8";

const getState = ({ setStore }) => {
	return {
		store: [],
		actions: {
			getStudentsAndActivities: cohortSlug => {
				let url = `https://api.breatheco.de/students/cohort/${cohortSlug}?access_token=${access_token}`;
				fetch(url, { cache: "no-cache" })
					.then(response => response.json())
					.then(data => {
						/****************************
						 *   FORMAT STUDENT NAMES
						 ****************************/
						const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

						let students = data.data.map(e => {
							// first_name: "null null", last_name: ""
							if (e.first_name.includes("null") && e.last_name == "") return { ...e, name: e.email };

							let newName = "";
							let first = "";
							let countUpperCase = 0;
							// first_name: "JohnDoe", last_name: ""
							// first_name: "JOHNDOE", last_name: ""
							for (let char of e.first_name) {
								if (countUpperCase == 4) {
									first = e.first_name;
									break;
								}
								if (char == char.toUpperCase()) {
									first += " " + char;
									countUpperCase++;
								} else first += char;
							}

							// first_name: "John doe", last_name: null
							// first_name: "john JIMMY", last_name: "JOE Doe"
							let nameArr = first.split(" ");
							if (e.last_name != null) nameArr = nameArr.concat(e.last_name.split(" "));
							for (let name of nameArr) newName += " " + capitalize(name);

							return { ...e, name: newName.slice(1) };
						});

						/****************************************************
						 *  FETCH COHORT ACTIVITIES AND MATCH WITH STUDENT
						 ****************************************************/
						url = `https://assets.breatheco.de/apis/activity/cohort/${cohortSlug}?access_token=${assets_token}`;
						fetch(url, { cache: "no-cache" })
							.then(response => response.json())
							.then(data => {
								console.log(data);
							});

						setStore({ students: students });
					});
			}
		}
	};
};

export default getState;
