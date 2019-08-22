import React from "react";
import { PropTypes } from "prop-types";
import { Context } from "../store/appContext";
import GreenThumb from "../../img/greenThumb.png";
import RedThumb from "../../img/redThumb.png";
import Loading from "../../img/loading.gif";

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
				{({ store }) => (
					<div className="col">
						{store.students && store.students.length === 0 ? (
							<img src={Loading} height="20" width="20" />
						) : (
							// Every student has many activities,
							// they could or could not be attendance related
							store.students.map(student =>
								student.activities.filter(e => e.slug.includes("attendance")).map((a, i) => {
									let show;
									if (a.slug.includes("unattendance")) show = <img src={RedThumb} />;
									else show = <img src={GreenThumb} />;
									return show;
								})
							)
						)}
					</div>
				)}
			</Context.Consumer>
		</div>
	);
};

Student.propTypes = {
	studentData: PropTypes.object
};
export default Student;
