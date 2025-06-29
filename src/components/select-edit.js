import Select from "react-select";

function CustomEditSelect(props) {
  return (
    <div
      style={{
        // zIndex: 999999999,
        marginTop: props.margin ? props.margin : 20,
        flex: !props.widthFull ? 3 : null,
        width: props.width,
      }}
    >
      {props.label ? (
        <label
          htmlFor={props.name}
          style={{
            color: "grey",
            fontSize: 13,
          }}
        >
          {props.label}
        </label>
      ) : null}
      <div style={{ marginTop: 5 }}>
        <Select
          styles={{
            control: (baseStyles) => ({
              ...baseStyles,
              backgroundColor: "rgb(238 241 249/1)",
              border: "1px solid #eaeaea",
            }),
          }}
          onChange={(e) => {
            props.onChange(e);
          }}
          isMulti={props.isMulti}
          value={props.value}
          options={props.options}
          isSearchable={true}
          placeholder={props.placeholder}
        />
      </div>
    </div>
  );
}

export default CustomEditSelect;
