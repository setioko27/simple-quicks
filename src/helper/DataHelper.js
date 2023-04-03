import dayjs from "dayjs"
export const toMoment = (data,format = 'YYYY-MM-DD') => {
    if(data) return dayjs(data,format)
    else{return null}
}

export const fromMoment = (date, format = 'YYYY-MM-DD') => {
    if(dayjs.isDayjs(date)) {
        return date.format(format)
    } else {
        return dayjs(date).format(format)
    }
}


export const viewDate = (data, format = "DD/MM/YYYY",formatData = "YYYY-MM-DD") => {
    const date = dayjs(data,formatData)
    //console.log(formatData)
    if(!data || !date.isValid()) return "--";
    return date.format(format)
}

export const dayLeft = (date) => {
    if(!date) return
    var d = toMoment(date).startOf('day'),
    l = d ? d.diff(dayjs().startOf('day'),'days') : 9999
    return l < 11 && l >= 2 ? l+" days left" : l <= 1 && l >= 0 ? l+" day left" : null
}

export const viewChatUser = (name) => name === "Me" ? "You" : name

export const isMoreNew = (date1,date2) => {
    if(!date1 || !date2) return false
    const d1 = toMoment(date1,"YYYY-MM-DD HH:mm:ss"),
    d2 = toMoment(date2,"YYYY-MM-DD HH:mm:ss")

    return d2.isAfter(d1)
}