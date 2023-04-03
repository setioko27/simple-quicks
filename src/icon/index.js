import Icon from "@ant-design/icons/lib/components/Icon";
import React from "react";

export {ReactComponent as ChatIcon} from "./ic-chat.svg"
export {ReactComponent as TaskIcon} from "./ic-task.svg"
export {ReactComponent as QuickIcon} from "./ic-quick.svg"
export {ReactComponent as AngleUpIcon} from "./ic-angle-up.svg"
export {ReactComponent as ClockIcon} from "./ic-clock.svg"
export {ReactComponent as PencilIcon} from "./ic-pencil.svg"
export {ReactComponent as LabelIcon} from "./ic-label.svg"
export {ReactComponent as LoadingIcon} from "./ic-loading.svg"
export {ReactComponent as UserIcon} from "./ic-user.svg"
export {ReactComponent as DownIcon} from "./ic-down.svg"

export const CustomIcon = (props) =>{
    return(
        <Icon component={props.icon} {...props} />
    )
} 