import { request, METHOD } from '@/utils/request'
export async function Update(params) {
    return request('/api/identity/my-profile', METHOD.POST, params)
}
export async function get(id) {
    return request(`/api/identity/my-profile`, METHOD.GET)
}
export async function changePassword() {
    return request('/api/identity/my-profile/change-password', METHOD.POST, params)
}
export default {
    Update,
    get,
    changePassword
}
