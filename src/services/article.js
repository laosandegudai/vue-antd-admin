import {request, METHOD} from '@/utils/request'
import { transformAbpListQuery,download } from '@/utils/abp'
import qs from 'querystring'
export async function getList(params) {
    return request("/api/app/article", METHOD.GET, transformAbpListQuery(params))
}
export async function createUpdate(params) {
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
    let url =`${process.env.VUE_APP_API_BASE_URL}/api/app/article/export-excel?${qs.stringify(params)}`;
    download(url,'文章.xlsx');
}
export function generateTemplate(){
    let url = `${process.env.VUE_APP_API_BASE_URL}/api/app/article/generate-template`;
    download(url,'文章导入模板.xlsx');
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
    createUpdate,
    del,
    dels,
    get,
    exportExcel,
    generateTemplate,
    importExcel
  }
  