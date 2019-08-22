import React from "react";
import { PropTypes } from "prop-types";
import { Context } from "../store/appContext";
import GreenThumb from "../../img/greenThumb.png";
import RedThumb from "../../img/redThumb.png";

const Student = props => {
	const obj = props.studentData;
	return (
		<div className="row mx-4 my-3 d-flex justify-content-between">
			<div className="col-3">
				<div>
					{obj.first_name} {obj.last_name}
				</div>
			</div>
			<Context.Consumer>
				{({ store }) => {
					let attendance = store.students.filter(e => e.activities.slug.includes("attendance"));
					return (
						<div className="col">
							{attendance.map((e, i) => (
								<span key={i}>{e.activities.slug}</span>
							))}
						</div>
					);
				}}
			</Context.Consumer>
		</div>
	);
};

Student.propTypes = {
	studentData: PropTypes.object
};
export default Student;
