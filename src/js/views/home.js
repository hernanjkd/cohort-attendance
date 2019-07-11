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
				return <div className="container" />;
			}}
		</Context.Consumer>
	);
};
