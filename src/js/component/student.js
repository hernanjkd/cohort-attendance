import { Context } from "../store/appContext";
import { PropTypes } from "prop-types";
import GreenThumb from "../../img/greenThumb.png";
import RedThumb from "../../img/redThumb.png";

export const Student = () => {
    return (
        <div>
            <span>{props.name}</span>
            {props.assistance.map((item, index) => {
                return (
                    <span key={index}>
                        <img src={((item.out - item.in) / 9) < 90 ? RedThumb : GreenThumb} />
                    </span>
                )
            })}
        </div>
    )
};

Student.propTypes = {
    name: PropTypes.string,
    assistance: PropTypes.array
}