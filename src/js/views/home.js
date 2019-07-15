import React from "react";
import { Context } from "../store/appContext";
import { Student } from "../component/student";
import GreenThumb from "../../img/greenThumb.png";
import RedThumb from "../../img/redThumb.png";

export const Home = () => {
	return (
		<Context.Consumer>
			{({ store, actions }) => {
				return (
					<div className="container border border-secondary bg-light mt-2 p-3">
						<select onChange={e => actions.getStudentsFromCohort(e.target.value)}>
							{store.cohorts &&
								store.cohorts.map((e, i) => {
									return (
										<option key={i} value={e.slug}>
											{e.name}
										</option>
									);
								})}
						</select>
						{store.students && !store.students.length ? (
							<h2 className="text-center my-5">STUDENT INFORMATION NOT AVAILABLE</h2>
						) : (
							<div className="row">
								<div className="col-3">Everyone</div>
								<div className="col">student assistance</div>
							</div>
						)}

						{store.students &&
							store.students.map((e, i) => {
								return <Student key={i} studentData={e} />;
							})}
					</div>
				);
			}}
		</Context.Consumer>
	);
};
