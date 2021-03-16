import { request, METHOD } from '@/utils/request'
import { transformAbpListQuery } from '@/utils/abp'
export async function getList(params) {
    return request("/api/multi-tenancy/tenants", METHOD.GET, transformAbpListQuery(params))
}
export async function createUpdate(params) {
    if (params.id) {
        return request(`/api/multi-tenancy/tenants/${params.id}`, METHOD.PUT, params)
    }
    return request("/api/multi-tenancy/tenants", METHOD.POST, params)
}
export async function del(id) {
    return request(`/api/multi-tenancy/tenants/${id}`, METHOD.DELETE)
}
export async function get(id) {
    return request(`/api/multi-tenancy/tenants/${id}`, METHOD.GET)
}
export function getDefaultConnectionString(id) {
    return request(`/api/multi-tenancy/tenants/${id}/default-connection-string`, METHOD.GET)
}

export function updateDefaultConnectionString(id, query) {
    return request(`/api/multi-tenancy/tenants/${id}/default-connection-string?defaultConnectionString=${query.defaultConnectionString}`, METHOD.PUT, query)
}

export function deleteDefaultConnectionString(id) {
    return request(`/api/multi-tenancy/tenants/${id}/default-connection-string`, METHOD.DELETE)
}
export function tenantSwitch(params){
    return request("/api/app/tenant/tenant-switch", METHOD.POST, params)
}
export default {
    getList,
    createUpdate,
    del,
    get,
    getDefaultConnectionString,
    updateDefaultConnectionString,
    deleteDefaultConnectionString,
    tenantSwitch
}
