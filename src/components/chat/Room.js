import React, {createContext,useContext,useRef,Fragment,useEffect, useState} from "react";
import { ArrowLeftOutlined, CloseOutlined, } from "@ant-design/icons";
import { Button, Result } from "antd";

import { useInbox } from "components/Inbox";
import PC from "components/PC";
import { isMoreNew, viewDate } from "helper/DataHelper";
import { useAPI } from "hook/useApi";
import { ChatIcon, CustomIcon, DownIcon } from "icon";
import Item from "./Item";
import ChatInput from "./Input";


const RoomContext = createContext()
export const useRoom = () => useContext(RoomContext)

export default function ChatRoom(){
    const {page,setPage} = useInbox(),
    {data,isLoading,isError,run,refresh} = useAPI('room/'+page,'inbox'),
    bodyRef = useRef(),
    {isLoading:isLoadingEdit,run:doEdit} = useAPI('room/'+page,'inbox','put'),
    [reply,setReply] = useState(null),
    
    handleBack = () =>{
        setPage('list')
    }

    let currentDate = useRef(""),
    newLabel = 0,
    contextValue = {
        data,
        refresh,
        isLoading,
        isLoadingEdit,
        doEdit,
        reply,
        setReply
    }

    
    
    useEffect(()=>{
        run()
    },[page]) // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(()=>{
        
        if(!data.messages || data.messages.length === 0) return
        console.log('woy')
        setTimeout(()=>{
            bodyRef.current.scrollTo({top:bodyRef.current.scrollHeight,behavior:"smooth"})
        },0)
    },[data]) // eslint-disable-line react-hooks/exhaustive-deps

    return(
        <RoomContext.Provider value={contextValue}>
            <div className="chat-room">
                <div className="chat-room-header flex-aligns-center g-14">
                    <div className="chat-room-back pointer" onClick={handleBack}>
                        <ArrowLeftOutlined />
                    </div>
                    <div className="chat-room-header-main">
                        <div className="chat-room-name">{data?.name??"..."}</div>
                        {data.type === "group" && <div className="chat-room-part">{data?.participant.length} Participants</div>}
                    </div>
                    <div className="chat-room-close pointer" onClick={handleBack}>
                        <CloseOutlined />
                    </div>
                </div>

                <div className="chat-room-body" ref={bodyRef}>
                    {isLoading ?
                        <PC.PageLoading text="Loading messages ..." /> :
                        isError ?
                            <Result
                                status="500"
                                title="Error load messages"
                                subTitle="Sorry, something went wrong."
                                extra={<Button type="primary" onClick={refresh}>Refresh</Button>}
                            /> :
                            data.messages.length === 0 ?
                                <PC.Empty icon={ChatIcon} text="No messages yet" /> :
                                <>
                                    {data.messages.map((d,i) => {
                                        var dates = d.timestamp.split(" "),
                                        isSameDate = dates[0] === currentDate.current,
                                        isNew = isMoreNew(data.last_view,d.timestamp)
                                        if(isNew) newLabel+= 1
                                        if(!isSameDate) currentDate.current = dates[0]
                                        if(i === 0) console.log(d.from,isSameDate,dates[0])
                                        return(
                                            <Fragment key={d.id}>
                                                {!isSameDate && <div className="chat-date"><span>{viewDate(dates[0],"MMMM DD, YYYY")}</span></div>}
                                                {isNew && newLabel === 1 && <div className="chat-new"><span>New Message <CustomIcon icon={DownIcon} /></span></div>}
                                                {isMoreNew()}
                                                <Item key={d.id} data={d}/>    
                                            </Fragment>
                                        )
                                    })}
                                </>

                    }
                </div>
                <ChatInput />
            </div>
        </RoomContext.Provider>
    )
}





