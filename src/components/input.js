function InputBox(props) {
  return (
    <div
      className={`${props.width !== undefined ? props.width : "w-full"} mt-${
        props.margin
      }`}
    >
      {props.label !== undefined ? (
        <>
          <label
            style={{
              color: "grey",
              fontSize: 13,
            }}
          >
            {props.label}
          </label>
          <br />
        </>
      ) : null}

      <input
        defaultValue={props.value}
        placeholder={props.placeholder}
        accept={props.accept}
        onSubmit={props.onSubmit}
        onChange={props.onChange}
        type={props.type}
        className="bg-background mt-1 p-2 py-2 w-full outline-none rounded-md"
      />
    </div>
  );
}

export default InputBox;
