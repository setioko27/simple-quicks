import React, { useState } from "react";
import dayjs from "dayjs";
import { CloseOutlined } from "@ant-design/icons";
import { Button, Input } from "antd";

import { useRoom } from "./Room";
import { fromMoment } from "helper/DataHelper";


export default function ChatInput(){
    const [value,setValue] = useState(''),
    {data,refresh,doEdit,reply,setReply} = useRoom(),
    [isLoading,setIsLoading] = useState(false),
    

    handleAdd = async() => {
        if(!value) return
        setIsLoading(true)
        try{
            var d = {
                messages : [...data.messages,{
                    "id": Date.now(),
					"timestamp": fromMoment(dayjs(),"YYYY-MM-DD HH:mm:ss"),
					"text": value,
					"reply": reply?reply.id:null,
					"from": 1
                }]
            }

            await doEdit(d)
            refresh()
            setValue("")
            setReply(null)
        }catch(e){}
        setIsLoading(false)
    }

    return(
        <div className="chat-input flex g-14">
            <div className="chat-input-field">
                {reply && <div className="chat-input-reply">
                    <div>
                        <b>Replying to {reply.sender}</b>
                        <p>{reply.text}</p>
                    </div>
                    <div className="chat-input-reply-close pointer" onClick={e => setReply(null)}>
                        <CloseOutlined />
                    </div>
                </div>}
                <Input placeholder="Type a new message" value={value} onChange={e => setValue(e.target.value)} />
            </div>
            <div>
                <Button type="primary" loading={isLoading} onClick={handleAdd}>Send</Button>
            </div>
        </div>
    )
}