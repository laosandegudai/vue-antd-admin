import store from '@/store'
const baseListQuery = {
  current: 1,
  pageSize: 10,
  sort: undefined,
  filter: undefined
}
export function transformAbpListQuery(query) {
  query.filter = query.filter === '' ? undefined : query.filter
  let order=query.sorter&&query.sorter.order?query.sorter.order.replace('end', ''):'';
  const abpListQuery = {
    maxResultCount: query.pageSize,
    skipCount: (query.current - 1) * query.pageSize,
    sorting:
      query.sorter&&query.sorter.field
        ? `${query.sorter.field} ${order}`
        : "",
    ...query
  }
  delete abpListQuery.current
  delete abpListQuery.pageSize
  delete abpListQuery.sorter
  return abpListQuery
}
export function checkPermission(policy) {
  const permissions = store.getters['account/permissions'];
  if (permissions.map(x=>x.id).indexOf(policy)>-1) {
    return true
  } else {
    return false
  }
}
export default baseListQuery
