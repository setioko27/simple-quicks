import { Popover } from "antd"
import React, { createContext, useContext, useEffect, useState } from "react"

const FloatBtn = ({type,icon,className}) => (
    <div className={`float-btn${type ? ' float-btn-'+type:""} ${className??""}`}>
        {icon}
    </div>
)
    

const FloatContext = createContext(),
useFloat = () => useContext(FloatContext)

const Group = ({toggleIcon,children,label}) => {
    const [isOpen,setIsOpen] = useState(false),
    [selected,setSelected] = useState(null),

    contextValue = {
        isOpen,
        setIsOpen,
        selected,
        setSelected
    }

    useEffect(()=>{
        if(isOpen) return
        setSelected(null)
    },[isOpen])

    return(
        <FloatContext.Provider value={contextValue}>
            <div className={`float-group float-wrap${isOpen?' open':''}${selected?' selected':''}`}>
                <div className="float-group-menu">
                    {children}
                </div>
                
                <div className='float-group-toggle' onClick={e => setIsOpen(!isOpen)}>
                    <FloatBtn type="primary" icon={toggleIcon} />
                </div>
            </div>
        </FloatContext.Provider>
    )
}

const Option = ({children,label,eventKey}) => {
   const {selected,setSelected} = useFloat()
    return(
        <div className={`float-group-option${selected === eventKey?" active":""}`} onClick={e => setSelected(eventKey)}><p>{label}</p>{children}</div>
    )
}
const Popovers = ({children,content,title,eventKey}) =>{
    const [open,setOpen] = useState(false),
    {selected} = useFloat()

    useEffect(()=>{
        var key = eventKey.replace('popover-',''),
        o = selected===key,
        d = o ? 500 : 0
        setTimeout(()=>{setOpen(o)},d)
        
    },[selected]) // eslint-disable-line react-hooks/exhaustive-deps


    return(
        <Popover
            arrow={false}
            open={open}
            placement="topRight"
            content={content} trigger="click">
            <>{children}</>
        </Popover>
    )
}


FloatBtn.Group = Group
FloatBtn.Option = Option
FloatBtn.Popover = Popovers

export default FloatBtn
