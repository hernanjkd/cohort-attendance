import React from "react";
import { Context } from "../store/appContext";
import Student from "../component/student";

import GreenThumb from "../../img/greenThumb.png";
import RedThumb from "../../img/redThumb.png";

export const Home = () => {
	let daysInCohort = 20;
	return (
		<Context.Consumer>
			{({ store, actions }) => {
				return (
					<div className="container border border-secondary bg-white mt-2 p-3">
						<select onChange={e => actions.getStudentsAndActivities(e.target.value)}>
							{store.cohorts.map((e, i) => {
								return (
									<option key={i} value={e.slug}>
										{e.name}
									</option>
								);
							})}
						</select>
						{store.students.length === 0 ? (
							<h2 className="text-center my-5">STUDENT INFORMATION NOT AVAILABLE</h2>
						) : (
							<table>
								<tbody>
									<tr>
										<td className="border p-3 d-flex justify-content-between">All</td>
										{new Array(daysInCohort).fill(null).map((e, i) => {
											return (
												<td key={i}>
													{store.dailyAvg[`day${i}`] === undefined ? (
														<i className="fas fa-exclamation-circle text-sand fa-lg" />
													) : (
														<img
															src={
																store.dailyAvg[`day${i}`] >= 85 ? GreenThumb : RedThumb
															}
														/>
													)}
												</td>
											);
										})}
									</tr>

									{store.students.map((e, i) => {
										return <Student key={i} studentData={e} daysInCohort={daysInCohort} />;
									})}
								</tbody>
							</table>
						)}
					</div>
				);
			}}
		</Context.Consumer>
	);
};
