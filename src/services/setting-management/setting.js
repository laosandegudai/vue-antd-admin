import {request, METHOD} from '@/utils/request'

export async function setSettingValues(params) {
    return request(`/api/settingUi/setSettingValues`, METHOD.PUT, params)
}
export async function resetSettingValues(params) {
    return request(`/api/settingUi/resetSettingValues`, METHOD.PUT, params)
}
export async function get() {
    return request(`/api/settingUi`, METHOD.GET)
}
