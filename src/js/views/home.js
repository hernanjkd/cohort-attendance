import React, { useState } from "react";
import { Context } from "../store/appContext";
import Popover from "../component/popover";

export const Home = props => {
	const [zoom, setZoom] = useState("font-size-10px");

	const params = new URLSearchParams(location.search);

	return (
		<Context.Consumer>
			{({ store, actions }) => {
				const daysInCohort = 120;
				const noData = <i className={`fas fa-exclamation-circle text-sand cursor-pointer ${zoom}`} />;
				const thumbsUp = <i className={`fas fa-thumbs-up text-darkgreen cursor-pointer ${zoom}`} />;
				const thumbsDown = <i className={`fas fa-thumbs-down text-darkred cursor-pointer ${zoom}`} />;
				return (
					<div className="mt-2 p-3 line-height-1">
						<select
							className="mb-4"
							onChange={e =>
								actions.getStudentsAndActivities({
									cohortSlug: e.target.value,
									access_token: params.get("access_token"),
									props
								})
							}>
							{store.cohorts.map((e, i) => (
								<option key={i} value={e.slug}>
									{e.name}
								</option>
							))}
						</select>
						{params.has("error") ? (
							<div className="text-center my-5">
								<h2 className="mb-5">Try renewing the access token in the url</h2>
								<h4>?access_token=d08334cd029fc1fdeff7cff7b263bdefc3819661</h4>
							</div>
						) : params.has("cohort_slug") && store.students.length === 0 ? (
							<h2 className="text-center my-5">STUDENT INFORMATION NOT AVAILABLE</h2>
						) : (
							params.has("cohort_slug") && (
								<div>
									<span
										className="position-absolute cursor-pointer"
										style={{ right: "50px", top: "30px" }}>
										{zoom.includes("10px") ? (
											<i
												className="fas fa-search-plus fa-lg"
												onClick={() => setZoom("font-size-25px")}
											/>
										) : (
											<i
												className="fas fa-search-minus fa-lg"
												onClick={() => setZoom("font-size-10px")}
											/>
										)}
									</span>
									<table className="d-inline-block cell-spacing">
										<tbody>
											{/*******************
											 *   EVERYONE NAME
											 *********************/}
											<tr>
												<td
													className="border rounded d-flex justify-content-between 
													mr-4 h-50px align-items-center">
													<b className="p-2 w-200px">Everyone</b>
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
											</tr>
											{/************************
											 *   ALLS STUDENT NAMES
											 **************************/}
											{store.students.map((e, i) => (
												<tr key={i}>
													<td
														className="border rounded d-flex justify-content-between mr-4 h-50px
														align-items-center">
														<span className="p-2 w-200px">
															{e.first_name} {e.last_name}
														</span>
														<span className="p-2">{Math.round(e.attendance.avg)}%</span>
													</td>
												</tr>
											))}
										</tbody>
									</table>
									<div className="d-inline-block overflow">
										<table className="cell-spacing">
											<tbody>
												{/******************************
												 *   FIRST ROW DAYS IN COHORT
												 ********************************/}
												<tr className=" hover-gray">
													{new Array(daysInCohort).fill(null).map((e, i) => (
														<td key={i} className="h-50px">
															<Popover
																body={
																	<div className="pop">
																		<div>Day {i + 1}</div>
																		{store.dailyAvg[`day${i + 1}`] ? (
																			<div>{store.dailyAvg[`day${i + 1}`]}%</div>
																		) : (
																			""
																		)}
																	</div>
																}>
																{store.dailyAvg[`day${i + 1}`] === undefined
																	? noData
																	: store.dailyAvg[`day${i + 1}`] >= 85
																		? thumbsUp
																		: thumbsDown}
															</Popover>
														</td>
													))}
												</tr>
												{/*********************************
												 *   ALLS STUDENT DAYS IN COHORT
												 ***********************************/}
												{store.students.map((data, i) => (
													<tr key={i} className="hover-gray">
														{new Array(daysInCohort).fill(null).map((e, i) => {
															let d = data.attendance[`day${i + 1}`]
																? data.attendance[`day${i + 1}`].created_at.date
																: null;
															let date = "";
															if (d) {
																date = new Date(d);
																date = `${
																	months[date.getMonth()]
																} ${date.getDate()}, ${date.getFullYear()}`;
															}
															return (
																<td key={i} className="h-50px">
																	<Popover
																		body={
																			<div className="pop">
																				<div>Day {i + 1}</div>
																				<div>{date}</div>
																			</div>
																		}>
																		{!data.attendance[`day${i + 1}`]
																			? noData
																			: data.attendance[
																					`day${i + 1}`
																			  ].slug.includes("unattendance")
																				? thumbsDown
																				: thumbsUp}
																	</Popover>
																</td>
															);
														})}
													</tr>
												))}
											</tbody>
										</table>
									</div>
								</div>
							)
						)}
					</div>
				);
			}}
		</Context.Consumer>
	);
};
