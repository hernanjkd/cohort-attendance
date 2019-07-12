import React from "react";
import { Context } from "../store/appContext";
import { PropTypes } from "prop-types";
import GreenThumb from "../../img/greenThumb.png";
import RedThumb from "../../img/redThumb.png";

export const Student = () => {
	const obj = props.studentData;
	return (
		<div className="row">
			<div className="col-3">
				{obj.first_name} {obj.last_name}
			</div>
			<div className="col">student assistance</div>
		</div>
	);
};

Student.propTypes = {
	studentData: PropTypes.object
};
