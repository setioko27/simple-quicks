import React from "react";
import PC from "./PC";
import { ChatLists } from "./chat/List";
import { createContext } from "react";
import { useContext } from "react";
import { useState } from "react";
import ChatRoom from "./chat/Room";

const InboxContext = createContext()

export default function Inbox(){
    const [page,setPage] = useState('list'),
    contextValue = {
        page,
        setPage
    }


    return(
        <InboxContext.Provider value={contextValue}>
            <PC>
                
                    {page === "list" ? 
                            
                        <ChatLists />
                         :
                        <ChatRoom />
                    }
            </PC>
        </InboxContext.Provider>
    )
}

export const useInbox = () => useContext(InboxContext)
