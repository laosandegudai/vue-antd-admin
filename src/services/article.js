import {request, METHOD} from '@/utils/request'
import { transformAbpListQuery } from '@/utils/abp'
import qs from 'querystring'
export async function getList(params) {
    return request("/api/app/article", METHOD.GET, transformAbpListQuery(params))
}
export async function edit(params) {
    if (params.id) {
        return request(`/api/app/article/${params.id}`, METHOD.PUT, params)
    }
    return request("/api/app/article", METHOD.POST, params)
}
export async function del(id) {
    return request(`/api/app/article/${id}`, METHOD.DELETE)
}
export async function dels(ids) {
    let idsStr='';
    ids.map((item,index) => {
        if(index>0){
            idsStr+='&';
        }
        idsStr+=`ids=${item}`;
    });
    return request(`/api/app/article?${idsStr}`, METHOD.DELETE)
}
export async function get(id) {
    return request(`/api/app/article/${id}`, METHOD.GET)
}
export function exportExcel(params){
    const a = document.createElement("a");
    a.href = `${process.env.VUE_APP_API_BASE_URL}/api/app/article/export-excel?${qs.stringify(params)}`;
    a.click();
    a.remove();
}
export function generateTemplate(){
    const a = document.createElement("a");
    a.href = `${process.env.VUE_APP_API_BASE_URL}/api/app/article/generate-template`;
    a.click();
    a.remove();
}
export async function importExcel(params) {
    let config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      }
    return request(`/api/app/article/import-excel`, METHOD.POST, params,config)
}
export default {
    getList,
    edit,
    del,
    dels,
    get,
    exportExcel,
    generateTemplate,
    importExcel
  }
  