import {request, METHOD} from '@/utils/request'
import { transformAbpListQuery } from '@/utils/abp'
export async function getList(params) {
    return request("/api/notification-service/notification", METHOD.GET, transformAbpListQuery(params))
}
export async function edit(params) {
    if (params.id) {
        return request(`/api/notification-service/notification/${params.id}`, METHOD.PUT, params)
    }
    return request("/api/notification-service/notification", METHOD.POST, params)
}
export async function del(id) {
    return request(`/api/notification-service/notification/${id}`, METHOD.DELETE)
}
export async function get(id) {
    return request(`/api/notification-service/notification/${id}`, METHOD.GET)
}
