import React from "react";
import "../../styles/home.scss";
import { Context } from "../store/appContext";

let num = -1234;

function sumDigits(num) {
	let x = String(num).split("");
	if (x[0] == "-") {
		x[1] = x[0] + x[1];
		x.shift();
	}
	x = x.reduce((a, b) => Number(a) + Number(b));
	alert(x);
}

sumDigits(num);

export class Home extends React.Component {
	render() {
		return (
			<Context.Consumer>
				{({ store }) => {
					return (
						<div className="text-center mt-5">
							<h1>Cohort Report</h1>
							<p>{console.log(store)}</p>
						</div>
					);
				}}
			</Context.Consumer>
		);
	}
}
