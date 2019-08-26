import React from "react";
import { PropTypes } from "prop-types";

import GreenThumb from "../../img/greenThumb.png";
import RedThumb from "../../img/redThumb.png";

const Student = props => {
	const data = props.studentData;
	return (
		<tr>
			<td className="border rounded my-2 d-flex justify-content-between mr-4">
				<span className="p-2">
					{data.first_name} {data.last_name}
				</span>
				<span className="p-2">{Math.round(data.attendance.avg)}%</span>
			</td>
			{new Array(props.daysInCohort).fill(null).map((e, i) => {
				return (
					<td key={i} className="p-1">
						{!data.attendance[`day${i}`] ? (
							<i className="fas fa-exclamation-circle text-sand fa-lg cursor-pointer" />
						) : (
							<img
								className="cursor-pointer"
								src={data.attendance[`day${i}`].slug.includes("unattendance") ? RedThumb : GreenThumb}
							/>
						)}
					</td>
				);
			})}
		</tr>
	);
};

Student.propTypes = {
	studentData: PropTypes.object,
	daysInCohort: PropTypes.number
};
export default Student;
