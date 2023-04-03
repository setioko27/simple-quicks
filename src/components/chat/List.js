import { Avatar, Button, Input, Result } from "antd"
import { useEffect, useState } from "react"
import { SearchOutlined } from "@ant-design/icons"

import { useInbox } from "components/Inbox"
import { isMoreNew, viewChatUser, viewDate } from "helper/DataHelper"
import { useAPI } from "hook/useApi"
import PC from "components/PC"
import { ChatIcon, CustomIcon, UserIcon } from "icon"


const {Header,Body,PageLoading,Empty} = PC
export function ChatLists(){
    const {data:list,isLoading,isError,run,refresh} = useAPI('chat-list','inbox')
    useEffect(()=>{run()},[])// eslint-disable-line react-hooks/exhaustive-deps
    return(
        <>
            <Header className="inbox-header">
                <Input 
                    placeholder="Search"
                    suffix={<SearchOutlined />} 
                    className="inbox-header-input" />
            </Header>
            <Body>
                <div className="chat-list">
                    {isLoading ?
                            <PageLoading text="Loading Chats ..." />
                        :
                        isError ? 
                            <Result
                                status="500"
                                title="Error Load  Task Data"
                                subTitle="Sorry, something went wrong."
                                extra={<Button type="primary" onClick={refresh}>Refresh</Button>}
                            />
                        :
                        list.length > 0 ?
                            list.map(d => <Item key={d.id} data={d} />)
                        :
                            <Empty icon={ChatIcon} text="No available chat" />

                    }
                </div>
            </Body>
        </>
    )
}

function AvatarGroup(){
    return(
    <Avatar.Group>
        <Avatar size={34} icon={<CustomIcon icon={UserIcon} />} />
        <Avatar size={34} icon={<CustomIcon icon={UserIcon} />} />
    </Avatar.Group>
    )
}

function Item({data}){
    const [isNew,setIsNew] = useState(false),
    {setPage} = useInbox(),

    handleClick = () => {
        setPage(data.id)
    }

    useEffect(()=>{
        setIsNew(data.last_message&&isMoreNew(data.last_view,data.last_message.timestamp))
    },[]) // eslint-disable-line react-hooks/exhaustive-deps
    return(
        <div className="chat-list-item flex g-16" onClick={handleClick}>
            <div className="chat-list-left">
                {data?.type==="group" ?
                    <AvatarGroup /> :
                    <Avatar className="ant-avatar-blue" size={34}>{data.name.charAt(0)}</Avatar>
                }
            </div>
            <div className="chat-list-right">
                <div className="chat-list-header flex g-16">
                    <div className="chat-list-name">{data.name}</div>
                    <div className="chat-list-created">{viewDate(data.created,"DD/MM/YYYY HH:mm",'YYYY-MM-DD HH:mm:ss')}</div>
                </div> 
                <div className={`chat-list-last ${isNew?"new":""}`}>
                    {data.last_message ?
                        <>
                            {data.type==="group" && <b>{viewChatUser(data.last_message.from)} :</b>}
                            <p>{data.last_message.text}</p>
                        </> :
                        <span>No messages yet</span>
                        
                    }
                </div>
            </div>
        </div>
    )
}