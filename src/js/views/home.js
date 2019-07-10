import React from "react";
import "../../styles/home.scss";
import { Context } from "../store/appContext";
import { Student } from "../component/student";
import GreenThumb from "../../img/greenThumb.png";
import RedThumb from "../../img/redThumb.png";

export const Home = () => {
	return (
		<Context.Consumer>
			{({ store }) => {
				let attendanceArray = store.log && store.log.filter(e => e.slug.includes("attendance"));
				return (
					<div className="text-center mt-5">
						<h1>Cohort Report</h1>
						<p>
							{store.log &&
								attendanceArray.map((e, i) => {
									let d = e.created_at.date;
									return (
										<div key={i}>
											<span>{d.getMonth() + "/" + d.getDate() + "/" + d.getFullYear()}</span>
											<span className="p-3">{e.day ? e.day : "null"}</span>
											<img src={e.slug === "classroom_attendance" ? GreenThumb : RedThumb} />
										</div>
									);
								})}
						</p>
					</div>
				);
			}}
		</Context.Consumer>
	);
};
