import React from "react";
import { Context } from "../store/appContext";
import Student from "../component/student";

export const Home = () => {
	return (
		<Context.Consumer>
			{({ store, actions }) => {
				return (
					<div className="container border border-secondary bg-light mt-2 p-3">
						<select onChange={e => actions.getStudentsAndActivities(e.target.value)}>
							{store.cohorts &&
								store.cohorts.map((e, i) => {
									return (
										<option key={i} value={e.slug}>
											{e.name}
										</option>
									);
								})}
						</select>
						{Array.isArray(store.students) && !store.students.length ? (
							<h2 className="text-center my-5">STUDENT INFORMATION NOT AVAILABLE</h2>
						) : (
							<div className="row mx-4 my-3 d-flex justify-content-between">
								<div className="col-3">Everyone</div>
								<div className="col">student assistance</div>
							</div>
						)}

						{Array.isArray(store.students) &&
							store.students.map((e, i) => {
								return <Student key={i} studentData={e} />;
							})}
					</div>
				);
			}}
		</Context.Consumer>
	);
};
