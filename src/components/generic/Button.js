import "./button.css";

const Button = ({ value, onClick, id, disabled }) => {

    return (
        <button
            id={id}
            onClick={onClick}
            disabled={disabled}
        >
            {value}
        </button>
    );
};

export default Button;
