import { request, METHOD } from '@/utils/request'
export function getFeatures(query) {
    return request('/api/feature-management/features', METHOD.GET, query)
}

export function updateFeatures(query, payload) {
    return request('/api/feature-management/features', METHOD.PUT, payload,{
        params: query
    })
}
export default {
    getFeatures,
    updateFeatures
}
