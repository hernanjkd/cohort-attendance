const getState = ({ setStore, getActions }) => {
	return {
		store: {
			cohorts: [],
			students: []
		},
		actions: {
			getStudentsAndActivities: cohortSlug => {
				let url = `https://api.breatheco.de/students/cohort/${cohortSlug}?access_token=${
					process.env.ACCESS_TOKEN
					}`;

				// Fetch students from cohort
				fetch(url, { cache: "no-cache" })
					.then(response => response.json())
					.then(({ data }) => {
						getActions("formatNames")(data);

						// Fetch all activities from cohort
						url = `https://assets.breatheco.de/apis/activity/cohort/${cohortSlug}?access_token=${
							process.env.ASSETS_TOKEN
							}`;
						fetch(url, { cache: "no-cache" })
							.then(response => response.json())
							.then(activities => {
								// Merge students with their activities
								let obj = {};
								activities.log.forEach(e => {
									if (!obj[e.user_id]) obj[e.user_id] = [];
									obj[e.user_id].push(e);
								});
								data.forEach(e => (e.activities = obj[e.id] ? obj[e.id] : []));
								setStore({ students: data });
							});
					});
			},
			formatNames: data => {
				const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
				const getUserName = email => email.substring(0, email.indexOf("@")).toLowerCase();
				const fullTrim = str => {
					let newStr = "";
					str = str.trim();
					for (let i in str) if (str[i] !== " " || str[i - 1] !== " ") newStr += str[i];
					return newStr;
				};

				for (let i in data) {
					let first = data[i].first_name;
					let last = data[i].last_name;
					if (last === null) last = "";
					// In the fetch url, Students have email, Users have username
					let username =
						data[i].username === undefined ? getUserName(data[i].email) : getUserName(data[i].username);
					// first_name: null
					// first_name: "null null"
					if (first === null || first.includes("null")) {
						first = username;
					}
					// first === email username, keep lowercase
					else if (first.toLowerCase() === username && last === "") {
						first = username;
					} else {
						first = fullTrim(first);
						last = fullTrim(last);
						let arr = first.split(" ");
						// first_name: "John"
						// first_name: "JohnDoe"
						// first_name: "JOHNDOE"
						if (arr.length === 1) {
							if (first !== first.toLowerCase() && first !== first.toUpperCase()) {
								let temp = "";
								for (let char of first) {
									if (char === char.toUpperCase() && isNaN(char)) temp += " " + char;
									else temp += char;
								}
								first = temp.trim();
								arr = first.split(" ");
								if (arr.length === 1) first = capitalize(arr[0]);
							} else first = capitalize(first);
						}
						// first_name: "john doe", last_name: ""
						if (arr.length === 2 && last === "") {
							first = capitalize(arr[0]);
							last = capitalize(arr[1]);
						}
						// first_name: "john joe doe", last_name: ""
						else if (arr.length === 3 && last === "") {
							first = capitalize(arr[0]) + " " + capitalize(arr[1]);
							last = capitalize(arr[2]);
						}
						// first_name: "john billy", last_name: "joe doe"
						else if (last !== "") {
							let arrl = last.split(" ");
							for (let i in arr) arr[i] = capitalize(arr[i]);
							for (let i in arrl) arrl[i] = capitalize(arrl[i]);
							first = arr.join(" ");
							last = arrl.join(" ");
						}
					}
					data[i].first_name = first;
					data[i].last_name = last;
				}
			}
		}
	};
};

export default getState;
