import PropTypes from 'prop-types'

const getState = ({ setStore, getActions }) => {
	return {
		store: {
			cohorts: [],
			students: [],
			dailyAvg: {},
			totalAvg: null
		},
		actions: {
			getStudentsAndActivities: (cohortSlug, props) => {
				let url = `https://api.breatheco.de/students/cohort/${cohortSlug}?access_token=${
					process.env.ACCESS_TOKEN
					}`;

				// Fetch students from cohort
				fetch(url, { cache: "no-cache" })
					.then(response => {
						if (!response.ok) props.history.push('/renew_access_token');
						return response.json();
					})
					.then(({ data: students }) => {
						getActions("formatNames")(students);
						// Fetch all activities from cohort
						url = `https://assets.breatheco.de/apis/activity/cohort/${cohortSlug}?access_token=${
							process.env.ASSETS_TOKEN
							}`;
						fetch(url, { cache: "no-cache" })
							.then(response => response.json())
							.then(activities => {
								// Merge students with their activities
								let stuAct = {}; // {student_id: {day0: unattendance, day1: attendance, ...}}
								let dailyAvg = {}; // {day0: 89%, day1: 61%, ...}

								activities.log.filter(e => e.slug.includes("attendance")).forEach(e => {
									let day = `day${JSON.parse(e.data).day}`;
									// Create temp obj to store all activities by student id
									if (stuAct[e.user_id] === undefined) {
										stuAct[e.user_id] = {};
										stuAct[e.user_id].avg = 0;
									}
									if (dailyAvg[day] === undefined) {
										dailyAvg[day] = 0;
									}
									// Inside also store all the activities by creating a day property
									stuAct[e.user_id][day] = e;
									stuAct[e.user_id].avg += e.slug.includes("unattendance") ? 0 : 1;
									dailyAvg[day] += e.slug.includes("unattendance") ? 0 : 1;
								});
								// divide by the number of students to get the avg
								Object.keys(dailyAvg).map(
									key => (dailyAvg[key] = (dailyAvg[key] / students.length) * 100)
								);
								// divide by the amount of days recorded to get the avg
								Object.keys(stuAct).map(
									key =>
										(stuAct[key].avg =
											(stuAct[key].avg / (Object.keys(stuAct[key]).length - 1)) * 100) // Minus the avg key
								);
								students.forEach(e => (e.attendance = stuAct[e.id] ? stuAct[e.id] : []));
								setStore({ students, dailyAvg });
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

getState.propTypes = {
	history: PropTypes.object
}

export default getState;
