import {request, METHOD} from '@/utils/request'
import { transformAbpListQuery } from '@/utils/abp'
export async function getList(params) {
    return request(`/api/data-dictionary/data-dictionary`, METHOD.GET, transformAbpListQuery(params))
}
export async function createOrUpdate(params) {
    if (params.id) {
        return request(`/api/data-dictionary/data-dictionary/${params.id}`, METHOD.PUT, params)
    }
    return request("/api/data-dictionary/data-dictionary", METHOD.POST, params)
}
export async function del(id) {
    return request(`/api/data-dictionary/data-dictionary/${id}`, METHOD.DELETE)
}
export async function get(id) {
    return request(`/api/data-dictionary/data-dictionary/${id}`, METHOD.GET)
}
