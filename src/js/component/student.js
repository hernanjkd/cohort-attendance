import React from "react";
import { PropTypes } from "prop-types";
import GreenThumb from "../../img/greenThumb.png";
import RedThumb from "../../img/redThumb.png";

export const Student = props => {
	const obj = props.studentData;
	return (
		<div className="row">
			<div className="col-8 mx-4 my-3 d-flex justify-content-between">
				<div>Name: {obj.name}</div>
				<div>First: {obj.first_name}</div>
				<div>Last: {obj.last_name}</div>
			</div>
			<div className="col">student assistance</div>
		</div>
	);
};

Student.propTypes = {
	studentData: PropTypes.object
};
