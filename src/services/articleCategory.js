import {request, METHOD} from '@/utils/request'
// export async function add(params) {
//     return request("/api/app/articleCategory", METHOD.POST, params)
// }
export async function getList(params) {
    return request("/api/app/article-category", METHOD.GET,params)
}
export async function getTrees() {
    return request("/api/app/article-category/trees", METHOD.GET)
}
export async function createUpdate(params) {
    if (params.id) {
        return request(`/api/app/article-category/${params.id}`, METHOD.PUT, params)
    }
    return request("/api/app/article-category", METHOD.POST, params)
}
export async function del(id) {
    return request(`/api/app/article-category/${id}`, METHOD.DELETE)
}
export async function dels(ids) {
    let idsStr='';
    ids.map((item,index) => {
        if(index>0){
            idsStr+='&';
        }
        idsStr+=`ids=${item}`;
    });
    return request(`/api/app/article-category?${idsStr}`, METHOD.DELETE)
}
export async function get(id) {
    return request(`/api/app/article-category/${id}`, METHOD.GET)
}
export default {
    getList,
    createUpdate,
    del,
    dels,
    get,
    getTrees
  }
  