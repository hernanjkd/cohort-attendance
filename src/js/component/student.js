import React from "react";
import { PropTypes } from "prop-types";
import GreenThumb from "../../img/greenThumb.png";
import RedThumb from "../../img/redThumb.png";

export const Student = props => {
	const obj = props.studentData;
	return (
		<div className="row">
			<div className="col-3 mx-4 my-3 d-flex justify-content-between">
				<span>{"first: " + obj.first_name + " . last: " + obj.last_name}</span> <span>85%</span>
			</div>
			<div className="col">student assistance</div>
		</div>
	);
};

Student.propTypes = {
	studentData: PropTypes.object
};
