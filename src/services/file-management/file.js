import {request, METHOD} from '@/utils/request'
import { transformAbpListQuery } from '@/utils/abp'
import qs from 'querystring'
export async function getList(params) {
    return request("/api/file-management/file", METHOD.GET, transformAbpListQuery(params))
}
export async function create(params) {
    let config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      }
    return request("/api/file-management/file", METHOD.POST, params,config)
}
export async function manyCreate(params) {
    let config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      }
    return request("/api/file-management/file/many", METHOD.POST, params,config)
}
export async function update(params) {
    let config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      }
    return request(`/api/file-management/file/${params.id}`, METHOD.PUT, params,config)
}
export async function del(id) {
    return request(`/api/file-management/file/${id}`, METHOD.DELETE)
}
export async function get(id) {
    return request(`/api/file-management/file/${id}`, METHOD.GET)
}
export async function createDirectory(params){
    return request(`/api/file-management/file/create-directory`, METHOD.POST, params)
}
export async function getDownloadInfo(id){
    return request(`/api/file-management/file/${id}/downloadInfo`, METHOD.GET)
}
// export default {
//     getList,
//     createOrEdit,
//     del,
//     get
// }
  