import { Spin } from "antd";
import { CustomIcon, LoadingIcon } from "icon";
import React from "react";


export default function Loading(props){
    return(
        <Spin {...props} indicator={<CustomIcon icon={LoadingIcon} style={props.style} spin />} />
    )
}