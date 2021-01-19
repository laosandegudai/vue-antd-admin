import {request, METHOD} from '@/utils/request'
import { transformAbpListQuery } from '@/utils/abp'

export function getOrganizationsAllWithDetails(query) {
  return request('/api/identity/organizations/all/details', METHOD.GET, query)
}

/**
 * 获取组织机构
 * Example: ?filter&sorting&skipCount=0&maxResultCount=20
 * @param {object} query
 */
export function getOrganizationsWithDetails(query) {
  return request('/api/identity/organizations/details', METHOD.GET, query)
}

/**
 * 后期考虑提交PR给abp,没有获取根节点的方法
 * @param {object} query
 */
export function getOrganizationsRoot() {
  return request('/api/identity/organizations/root', METHOD.GET)
}

export function getOrganizationSingleWithDetails(id) {
  return request(`/api/identity/organizations/${id}/details`, METHOD.GET)
}

export function getOrganizationSingle(id) {
  return request(`/api/identity/organizations/${id}`, METHOD.GET)
}

export function getOrganizationsAll() {
  return request('/api/identity/organizations/all', METHOD.GET)
}

export function getOrganizations(query) {
  return request('/api/identity/organizations', METHOD.GET,transformAbpListQuery(query))
}

export function getOrganizationChildren(pid) {
  return request(`/api/identity/organizations/children/${pid}`, METHOD.GET)
}

export function getOrgUsers(query) {
  return request('/api/identity/organizations/users', METHOD.GET,transformAbpListQuery(query))
}

export function getOrgRoles(query) {
  return request('/api/identity/organizations/roles', METHOD.GET,transformAbpListQuery(query))
}

export function createOrganization(payload) {
  return request('/api/identity/organizations', METHOD.POST, payload)
}

export function updateOrganization(id, payload) {
  return request(`/api/identity/organizations/${id}`, METHOD.PUT, payload)
}

export function deleteOrganization(id) {
  return request(`/api/identity/organizations/${id}`, METHOD.DELETE)
}
export async function edit(params) {
  if (params.id) {
      return request(`/api/identity/organizations/${params.id}`, METHOD.PUT, params)
  }
  return request('/api/identity/organizations', METHOD.POST, params)
}
