import { CustomIcon } from "icon";
import React from "react";
import Loading from "./Loading";

const PC = ({children}) => <div className="pc">{children}</div>,
    Header = ({children,className}) => <div className={`pc-header flex-between${className?" "+className:""}`}>{children}</div>,
    Body = ({children,domRef}) => <div className="pc-body" ref={domRef}>{children}</div>,
    PageLoading = ({text}) => {
        return(
            <div className="pc-loading">
                <div>
                    <Loading style={{fontSize: 85,color: '#c4c4c4'}} />
                    <p>{text}</p>
                </div>
            </div>
        )
    },
    Empty = ({icon,text,action}) => {
        return(
            <div className="pc-empty">
                <div>
                    <CustomIcon icon={icon} />
                    <p>{text}</p>
                    <div className="pc-empty-action">{action}</div>
                </div>
            </div>
        )
    }

PC.Header = Header
PC.Body = Body
PC.PageLoading = PageLoading
PC.Empty = Empty

export default PC
