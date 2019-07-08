import React from "react";
import "../../styles/home.scss";
import { Context } from "../store/appContext";

export class Home extends React.Component {
	render() {
		return (
			<Context.Consumer>
				{({ store }) => {
					return (
						<div className="text-center mt-5">
							<h1>Hello Rigo!</h1>
							<p>
								{store.students[0].assistance.map((item, index) => {
									return (
										<div key={index}>
											<div>{String(item.date)}</div>
											<div>{item.in}</div>
											<div>{item.out}</div>
											<div>{String((item.out - item.in) / 9).substr(0, 5)}%</div>
										</div>
									);
								})}
								{/* {console.log(store.students)} */}
							</p>
							<a href="#" className="btn btn-success">
								If you see this green button, bootstrap is working
							</a>
						</div>
					);
				}}
			</Context.Consumer>
		);
	}
}
