import React, { useEffect, useState, useRef } from "react";
import {EllipsisOutlined} from "@ant-design/icons";
import { Button, Checkbox, Col, DatePicker, Dropdown, Input, Result, Row, Select, Tag } from "antd";
import dayjs from "dayjs";

import { dayLeft, fromMoment, toMoment, viewDate } from "helper/DataHelper";
import {useAPI, useCRUD } from "hook/useApi";
import { AngleUpIcon, ClockIcon, CustomIcon, LabelIcon, PencilIcon, TaskIcon } from "icon";
import Loading from "./Loading";
import PC from "./PC";

const {Option} = Select,
emptyData = {
    id: 0,
    title: "",
    due: "",
    description: "",
    label: [],
    type: "",
    completed: false
},
{Header,Body,PageLoading,Empty} = PC


export default function Task(){
    const {get,remove,put,post} = useCRUD("task"),
    {data:task,isLoading,isError,run,refresh} = get(),
    {run:doAdd,isLoading:isLoadingAdd} = post(),
    {data:labels,run:loadLabel} = useAPI('label'),
    [type,setType] = useState('my-task'),
    [displayedData,setDisplayedData] = useState([]),
    bodyRef = useRef(),
    
    handleAdd = async() => {
        await doAdd({...emptyData,id: Date.now(),type})
        await refresh()
        var body = bodyRef.current
        setTimeout(()=>{body.scrollTo({top: body.scrollHeight,behavior:'smooth'})},500)
    }
    useEffect(()=>{
        if(!task) return
        var t = task,
        d = t.filter(d => d.type === type)
        setDisplayedData(d)
    },[task.length,type]) // eslint-disable-line react-hooks/exhaustive-deps
    
    

    useEffect(()=>{
        run()
        loadLabel()
    },[])// eslint-disable-line react-hooks/exhaustive-deps

    
    return(
        <PC>
            <Header className="task-header">
                <Select
                    value={type} 
                    onChange={v => setType(v)} 
                    popupClassName="dropdown-filter"
                >
                    <Option value="my-task">My Task</Option>
                    <Option value="personal">Personal Errands</Option>
                    <Option value="urgenr">Urgent To-Do</Option>
                </Select>
                <Button type="primary" onClick={handleAdd}>New Task</Button>
            </Header>
            <Body domRef={bodyRef}>
                <Loading spinning={isLoadingAdd}>
                {((isLoading && task.length === 0)) ? 
                        <PageLoading text="Loading Task ..." /> 
                    :
                    isError ? <Result
                                status="500"
                                title="Error Load  Task Data"
                                subTitle="Sorry, something went wrong."
                                extra={<Button type="primary" onClick={refresh}>Refresh</Button>}
                            />
                        :
                        <>
                            {displayedData.length > 0 ? 
                                displayedData.map(d => 
                                    <Item 
                                        key={d.id} 
                                        data={d} 
                                        controller={{put,remove,refresh}} 
                                        labels={labels}
                                        type={type}
                                    />
                                ) : 
                                <Empty icon={TaskIcon} text="No available task" action={<Button type="primary" onClick={handleAdd}>New Task</Button>} />
                            }
                       </>
                }
                </Loading>
                
            </Body>
        </PC>
    )
}

function Item({data,controller,labels,type}){
    const [isExpand,setIsExpand] = useState(false),
    {put,remove,refresh} = controller,
    {isLoading,run:doEdit} = put(data.id),
    {isLoading:isLoadingRemove,run:doRemove} = remove(data.id),
    [tempDesc,setTempDesc] = useState(''),
    [state,setState] = useState(emptyData),
    {title,due,description,label,completed} = state,

    handleChange = async(value,index) => {
        if(index === "title" && value === "") return
        console.log(value,index)
        var s = {
            ...state,
            [index]: value
        }
        setState(s)
        await doEdit(s)
        refresh()
    },
    handleBlur = () => {
        if(tempDesc !== state.description){
            handleChange(tempDesc,'description')
        }
    },
    handleMenuClick = async({key}) => {
        if(key === "delete"){
            await doRemove()
            refresh()
        }
    }

    
    

    useEffect(()=>{
        setState(data)
        setTempDesc(data.description)
        setIsExpand(data.title === "")
    },[])// eslint-disable-line react-hooks/exhaustive-deps

    return(
        
        <div className={`task-item${completed?" checked":""}`}>
            <Loading spinning={isLoading || isLoadingRemove}>
                <div className="flex g-12">
                    
                    <div className="task-checkbox">
                        <Checkbox checked={completed} onChange={e => handleChange(e.target.checked,'completed')} />
                    </div>
                    <div className="task-main">
                        <Row className="task-head flex-between">
                            <Col span={14}>
                                <div className="task-name">
                                    {title  ? title :<Input placeholder="Type Task Title" onBlur={e => handleChange(e.target.value,'title')} />}
                                </div>
                            </Col>
                            <Col span={10} className="flex-end g-12">
                                <div className="task-due flex g-12">
                                    <span className="text-red">{dayLeft(due)}</span> 
                                    {viewDate(due)}
                                </div>
                                <div className="task-toggle" onClick={e => setIsExpand(!isExpand)}><CustomIcon icon={AngleUpIcon} rotate={isExpand ? 0 : 180} style={{fontSize: 20}} /></div>

                                <Dropdown
                                    placement="bottomRight"
                                    menu={{
                                        items:[{key:"delete",label:"Delete",className:"text-red"}],
                                        onClick:handleMenuClick
                                    }}
                                >
                                    <div className="task-menu"><EllipsisOutlined /></div>
                                </Dropdown>
                                
                            </Col>
                        </Row>
                        <div className={`task-body${isExpand?" expand":""}`}>
                            
                            <div className="task-info flex g-20 mb-16">
                                <CustomIcon icon={ClockIcon} className={`icon${due?" filled": ""}`} />
                                <DatePicker 
                                    value={toMoment(due)} 
                                    format="DD/MM/YYYY" 
                                    onChange={(d) => handleChange(fromMoment(d),'due')} 
                                    allowClear={false}
                                    disabledDate= {(c) => c.endOf('day') < dayjs().endOf('day')}
                                />
                            </div>
                            <div className="task-info flex g-20 mb-16">
                                <CustomIcon icon={PencilIcon} className={`icon${description?" filled": ""}`} />
                                <Input.TextArea autoSize placeholder="No Description" bordered={false} className="task-input-borderless" value={tempDesc} onChange={e => setTempDesc(e.target.value)}  onBlur={handleBlur} />
                            </div>
                            <div className="task-info flex bg-grey g-20">
                                <CustomIcon icon={LabelIcon} className={`icon${label.length > 0?" filled": ""}`} />
                                <Select 
                                    className="task-label-select"
                                    value={label} 
                                    mode="multiple" 
                                    style={{ width: '100%' }}
                                    showArrow={false}
                                    tagRender={TagLabel}
                                    popupClassName="task-label-menu"
                                    onChange={v => handleChange(v,'label')}
                                >
                                    {labels.map(d => 
                                        <Select.Option 
                                            value={d.id} 
                                            title={d.title} 
                                            key={d.id}
                                            color={d.color}
                                            
                                        >
                                            <Tag style={{background: d.color}}>{d.title}</Tag>
                                        </Select.Option>
                                    )}
                                </Select>
                            </div>
                        </div>
                    </div>
                </div>
            </Loading>
        </div>
    )
}


function TagLabel({label,color,onClose}){
    return(
        <Tag 
            style={{background: color}}
            onClose={onClose}
            closable={false}
        >
            {label}
        </Tag>
    )
}