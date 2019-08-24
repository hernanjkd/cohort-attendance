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
					<div className="row mx-4 my-3 d-flex justify-content-between">
						<div className="col-3">
							{data.first_name} {data.last_name}
						</div>
						<div className="col">
							<table>
								<tbody>
									<tr>
										{new Array(20).map((e, i) => {
											let act = data.activities;
											return (
												<td key={i} className="thumbs mx-5">
													{/* <img
														src={e.slug.includes("unattendance") ? RedThumb : GreenThumb}
													/> */}
													{act[`day${i}`]}
													asdfasdf
												</td>
											);
										})}
									</tr>
								</tbody>
							</table>
						</div>
					</div>
				);
			}}
		</Context.Consumer>
	);
};

Student.propTypes = {
	studentData: PropTypes.object
};
export default Student;
