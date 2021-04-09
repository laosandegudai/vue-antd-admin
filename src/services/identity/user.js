import { request, METHOD } from '@/utils/request'
import { transformAbpListQuery } from '@/utils/abp'
export async function getList(params) {
    return request("/api/identity/users", METHOD.GET, transformAbpListQuery(params))
}
export async function getListWithDetails(params) {
    return request("/api/identity/users/details", METHOD.GET, transformAbpListQuery(params))
}
export async function createUpdate(params) {
    if (params.id) {
        return request(`/api/identity/users/${params.id}/update-to-organizations`, METHOD.PUT, params)
    }
    return request('/api/identity/users/create-to-organizations', METHOD.POST, params)
}
export async function del(id) {
    return request(`/api/identity/users/${id}`, METHOD.DELETE)
}
export async function get(id) {
    return request(`/api/identity/users/${id}`, METHOD.GET)
}
export function getAssignableRoles() {
    return request('/api/identity/users/assignable-roles', METHOD.GET)
}
export function getRolesByUserId(id) {
    return request(`/api/identity/users/${id}/roles`, METHOD.GET)
}
export function getOrganizationsByUserId(id, includeDetails = false) {
    return request(`/api/identity/users/${id}/organizations`, METHOD.GET,includeDetails)
  }
export default {
    getList,
    getListWithDetails,
    createUpdate,
    del,
    get,
    getAssignableRoles,
    getRolesByUserId,
    getOrganizationsByUserId
}
