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
						<td className="border rounded my-2 d-flex justify-content-between">
							<span className="p-2">
								{data.first_name} {data.last_name}
							</span>
							<span className="p-2">{Math.round(data.attendance.avg)}%</span>
						</td>
						{new Array(props.daysInCohort).fill(null).map((e, i) => {
							return (
								<td key={i} className="">
									{!data.attendance[`day${i}`] ? (
										<i className="fas fa-exclamation-circle text-sand fa-lg" />
									) : (
										<img
											src={
												data.attendance[`day${i}`].slug.includes("unattendance")
													? RedThumb
													: GreenThumb
											}
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
