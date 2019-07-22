const access_token = "ead2dc2fc5d1c5bcfa48b83ef1b6816034a5d575";
const assets_token =
	"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjbGllbnRJZCI6NTUzLCJpYXQiOjE1NjM1OTc3OTAsImV4cCI6MzMxMjA1NDk3OTB9.XPJ65Z27q2SbCKeI7omza9uVKJLEC0mH6XiniVzU8AA";

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
							if (
								(e.first_name.includes("null") && e.last_name == "") ||
								(e.first_name == null && e.last_name == null)
							) {
								let userName = e.email.includes("@")
									? e.email.substring(0, e.email.indexOf("@"))
									: e.email;
								return { ...e, name: userName };
							}

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

							return { ...e, name: newName.trim() };
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
