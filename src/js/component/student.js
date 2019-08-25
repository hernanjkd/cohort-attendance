import React from "react";
import { PropTypes } from "prop-types";
import { Context } from "../store/appContext";

import GreenThumb from "../../img/greenThumb.png";
import RedThumb from "../../img/redThumb.png";

const Student = props => {
	const data = props.studentData;
	return (
		<Context.Consumer>
			{({ store }) => {
				return (
					<tr>
						<td>
							{data.first_name} {data.last_name}
						</td>
						{new Array(props.daysInCohort).fill(null).map((e, i) => {
							let act = data.activities;
							return (
								<td key={i} className="thumbs mx-5">
									{!act[`day${i}`] ? (
										<i className="fas fa-exclamation-circle text-sand fa-lg" />
									) : (
										<img
											src={act[`day${i}`].slug.includes("unattendance") ? RedThumb : GreenThumb}
										/>
									)}
								</td>
							);
						})}
					</tr>
				);
			}}
		</Context.Consumer>
	);
};

Student.propTypes = {
	studentData: PropTypes.object,
	daysInCohort: PropTypes.number
};
export default Student;
