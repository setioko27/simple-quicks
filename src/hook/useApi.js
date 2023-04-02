import axios from "axios"
import { useRef, useState } from "react"
import {toast} from "react-toastify"


const API_URL = "https://642aa943b11efeb7599f11df.mockapi.io/api"
const handleError = (e) =>{
    //console.log('error',e, e.response)
    if (e.response) {
        if(e.response.status === 422) {
            if(e.response.data && e.response.data.errors) {
                const { errors } = e.response.data
                for (const attribute in errors) {
                    if(errors.hasOwnProperty(attribute)) toast.error(errors[attribute][0])
                }
            }
        }else if(e.response.status === 403){
            var url = e.response.config.url.split('/').pop()
            if(localStorage.getItem(url)){
                if(e.response.config.method.toLowerCase() !== "get"){
                    toast.error("Sorry, you are not authorized to perform this action",5)
                    
                }else{
                    toast.error('Sorry, you are not authorized to access this page',5)
                }

            }else{
                localStorage.setItem(url,true)
                if(e.response.config.method.toLowerCase() === "get"){
                    window.location.reload()
                }
            }
            
        }  else if([400,504].includes(e.response.status)) {
            toast.error(e.response.data.message);
        } else {
            toast.error(e.message);
        }
    } else if (e.request) {
        toast.error(e.message);
    } else {
        toast.error(e.message);
    }
}

const CustomException = (e) => {
    const error = new Error(e)
    error.response = e.response

    return error
}

export const RequestApi = async(url, method = 'get', data = {}, msg= "",header=null) => {
    
    try{
        var Param = {
            method,
            url: API_URL+"/"+url,
            data
        }
        if(header){ Param.headers = header}

        const req = await axios(Param)
        localStorage.removeItem(API_URL+"/"+url)
        if(msg) toast.success(msg)
        return req
    }catch(e){
        if(msg !== null) handleError(e)
        throw CustomException(e)
    }
}


export const useApi = (url,method="get",body,msg = null) => {
    const cache = useRef({}),
    [data,setData] = useState([]),
    [isLoading,setLoading] = useState(method === "get"),
    [isError,setIsError] = useState(false),

    runFunction = async(body=null,refresh="false") => {
        setLoading(true)
        if(cache.current[url] && !refresh){
            setData(cache.current[url])
            setLoading(false)
        }else{
            try{
                const res = await RequestApi(url,method,body,msg)
                setData(res.data)
                cache.current[url] = res.data
            }catch(e){
                setIsError(true)
            }
            setLoading(false)
        }
    },
    refresh = () => runFunction(null,true)

    return{ data,isLoading,isError,run:runFunction,refresh}

}

export const useCRUD = (url) => {
    const useGet = () => useApi(url),
    usePost = (msg=null) => useApi(url,'post',msg),
    usePut = (id,msg) => useApi(url+"/"+id,"put",msg),
    useRemove = (id,msg=null) => useApi(url+"/"+id,'delete',msg)

    return {
        get:useGet,post:usePost,put:usePut,remove:useRemove
    }
    
}