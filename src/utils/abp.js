import store from '@/store'
import Cookie from 'js-cookie'
const xsrfHeaderName = 'Authorization'
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
  delete abpListQuery.showTotal
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
export function download(url,name){
  let xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.responseType = "blob";
  xhr.setRequestHeader("Authorization", Cookie.get(xsrfHeaderName));
  xhr.onload = function () {
      if (this.status === 200) {
          var blob = this.response;
          var reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onload = function (e) {
              var a = document.createElement('a');
              a.download = name;
              a.href = e.target.result;
              a.click();
              a.remove();
          }
      }
  };
  xhr.send()
}
export default baseListQuery
