import { ChatIcon, CustomIcon, QuickIcon, TaskIcon } from "icon";
import React from "react";
import FloatBtn from "./FloatBtn";
import Task from "./Task";
import Inbox from "./Inbox";

const {Group,Option,Popover} = FloatBtn
export default function Actions(){
    return(
        <Group toggleIcon={<CustomIcon icon={QuickIcon} />}>
            <Option label="Inbox" eventKey="inbox">
                <Popover content={<Inbox />} eventKey="popover-inbox">
                    <FloatBtn type="purple" icon={<CustomIcon icon={ChatIcon} />}></FloatBtn>
                </Popover>
            </Option>
            <Option label="Task" eventKey="task">
                <Popover content={<Task />} eventKey="popover-task">
                    <FloatBtn type="yellow" icon={<CustomIcon icon={TaskIcon} />}></FloatBtn>
                </Popover>
            </Option>
            
        </Group> 
    )
}