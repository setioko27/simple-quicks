import React, {useState,useRef} from "react";
import { Dropdown } from "antd";
import { EllipsisOutlined } from "@ant-design/icons";

import { useRoom } from "./Room";
import Loading from "components/Loading";
import { viewDate } from "helper/DataHelper";



export default function Item({data}){
    const {data:roomData,doEdit,refresh,setReply} = useRoom(),
    {participant} = roomData,
    [isLoading,setIsLoading] = useState(false),
    getReply = (id) => roomData.messages.filter(d => d.id === id)[0],
    sender = () => participant.filter(d => d.id === data.from)[0],
    isMe = useRef(data.from === 1),
    handleMenuClick = async({key}) => {
        if(key === "delete"){
            try{
                setIsLoading(true)
                var d = {
                    messages : roomData.messages.filter(d => d.id !== data.id)
                }

                await doEdit(d)
                refresh()
            }catch(e){}
            setIsLoading(false)
        }else if(key === "reply"){
            setReply({...data,sender: isMe.current ? "Me" : sender().name})
        } 
    }
    return(
        <Loading spinning={isLoading} >
            <div className={`chat-item ${isMe.current?"sent":"received"} ${sender().color}`}>
                <div className="chat-item-sender">
                    {isMe.current ? "You":sender().name}
                </div>
                {data.reply && <div className="chat-item-reply">
                    {getReply(data.reply)?.text??"Message has been deleted"}
                </div>}
                <div className="flex-align-start g-12">
                    
                    <div className="chat-item-box">
                        <p>{data.text}</p>
                        <span>{viewDate(data.timestamp,'HH:mm',"YYYY-MM-DD HH:mm:ss")}</span>
                    </div>
                    <Dropdown
                        className="chat-item-menu"
                        menu={{
                            items:[
                                {key:"reply",label:"Reply",className:"text-blue"},
                                {key:"edit",label:"Edit",className:"text-blue", style:{display: isMe.current ? "block":"none"}},
                                {key:"delete",label:"Delete",className:"text-red",style:{display: isMe.current ? "block":"none"}},
                            ],
                            onClick:handleMenuClick
                        }}
                        placement="bottomRight"
                        trigger="click"
                    >

                        <EllipsisOutlined />
                    </Dropdown>
                </div>
            </div>
        </Loading>
    )
}