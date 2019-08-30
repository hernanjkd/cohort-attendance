import React from "react";
import { Context } from "../store/appContext";
import Student from "../component/student";

export const Home = () => {
	return (
		<Context.Consumer>
			{({ store, actions }) => {
				let daysInCohort = 120;
				return (
					<div className="mt-2 p-3">
						<select className="mb-4" onChange={e => actions.getStudentsAndActivities(e.target.value)}>
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
							<div style={{ width: "600px", overflow: "scroll" }}>
								<table>
									<tbody>
										<tr>
											<td className="border rounded my-2 d-flex justify-content-between mr-4">
												<b className="p-2" style={{ width: "200px" }}>
													Everyone
												</b>
												<b className="p-2">
													{Math.round(
														store.students.reduce(
															(total, x) => total + x.attendance.avg,
															0
														) / store.students.length
													)}
													%
												</b>
											</td>
											{new Array(daysInCohort).fill(null).map((e, i) => {
												return (
													<td key={i} className="p-1">
														{store.dailyAvg[`day${i}`] === undefined ? (
															<i className="fas fa-exclamation-circle text-sand fa-lg cursor-pointer" />
														) : (
															<span>
																{store.dailyAvg[`day${i}`] >= 85 ? (
																	<i className="fas fa-thumbs-up font-size-25px text-darkgreen" />
																) : (
																	<i className="fas fa-thumbs-down font-size-25px text-darkred" />
																)}
															</span>
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
							</div>
						)}
					</div>
				);
			}}
		</Context.Consumer>
	);
};
