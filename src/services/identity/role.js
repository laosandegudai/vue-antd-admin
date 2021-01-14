import {request, METHOD} from '@/utils/request'
import { transformAbpListQuery } from '@/utils/abp'
export async function getList(params) {
    return request("/api/identity/roles", METHOD.GET, transformAbpListQuery(params))
}
export async function edit(params) {
    if (params.id) {
        return request(`/api/identity/roles/${params.id}`, METHOD.PUT, params)
    }
    return request("/api/identity/roles", METHOD.POST, params)
}
export async function del(id) {
    return request(`/api/identity/roles/${id}`, METHOD.DELETE)
}
export async function get(id) {
    return request(`/api/identity/roles/${id}`, METHOD.GET)
}
export default {
    getList,
    edit,
    del,
    get
  }
  