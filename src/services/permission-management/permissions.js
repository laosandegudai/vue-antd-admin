import {request, METHOD} from '@/utils/request'
import { transformAbpListQuery } from '@/utils/abp'
export async function getList(params) {
    return request("/api/permission-management/permissions", METHOD.GET, transformAbpListQuery(params))
}
export async function edit(query, payload) {
    return request(`/api/permission-management/permissions?providerName=${query.providerName}&providerKey=${query.providerKey}`, METHOD.PUT, payload)
}
export async function del(id) {
    return request(`/api/permission-management/permissions/${id}`, METHOD.DELETE)
}
export async function get(params) {
    return request(`/api/permission-management/permissions`, METHOD.GET,params)
}
export default {
    getList,
    edit,
    del,
    get
  }
  