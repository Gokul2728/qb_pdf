// function CustomButton(props) {
//   return (
//     <button
//       className={` w-${
//         props.width ?? "full"
//       } p-2 text-md text-white tracking-wider font-medium rounded-md mt-${
//         props.margin
//       } ${props.danger ? "bg-red" : "bg-primary"}`}
//       onClick={props.onClick}
//     >
//       {props.label}
//     </button>
//   );
// }

// export default CustomButton;

function CustomButton(props) {
  const {
    label,
    width = "full",
    margin = 0,
    danger = false,
    onClick,
    disabled = false,
  } = props;

  return (
    <button
      className={`w-${width} p-2 text-md tracking-wider font-medium rounded-md mt-${margin} ${
        disabled
          ? "bg-gray-400 cursor-not-allowed text-white"
          : danger
          ? "bg-red text-white"
          : "bg-primary text-white"
      }`}
      onClick={!disabled ? onClick : undefined}
      disabled={disabled}
    >
      {label}
    </button>
  );
}
export default CustomButton;
