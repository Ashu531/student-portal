import React from "react";
import Switch from "react-switch";
import "./switch.css";

export default function SwitchComponent({
    checked,
    onChange,
    label,
    enabled,
    align = 'flex-end'
}) {
    return (
        <div className="row" style={{ gap: '5px', justifyContent: align }}>
            <Switch 
                onChange={onChange}
                checked={checked}
                disabled={!enabled}
                offColor="#888"
                onColor="#0c6"
                uncheckedIcon={false}
                checkedIcon={false}
                height={16}
                width={32}
            />
            <label
                className="Label text-Poppins text-10 text-weight-5"
                htmlFor="airplane-mode"
                style={{ paddingRight: 15 }}
            >
                {label}
            </label>
        </div>
    );
}
