import TabsView from '@/layouts/tabs/TabsView'
import BlankView from '@/layouts/BlankView'
import PageView from '@/layouts/PageView'

// 路由配置
const options = {
  routes: [
    {
      path: '/login',
      name: '登录页',
      component: () => import('@/pages/login')
    },
    {
      path: '*',
      name: '404',
      component: () => import('@/pages/exception/404'),
    },
    {
      path: '/403',
      name: '403',
      component: () => import('@/pages/exception/403'),
    },
    {
      path: '/',
      name: '首页',
      component: TabsView,
      redirect: '/login',
      children: [
        {
          path: 'dashboard',
          name: 'Dashboard',
          meta: {
            icon: 'dashboard'
          },
          component: BlankView,
          children: [
            {
              path: 'analysis',
              name: '分析页',
              component: () => import('@/pages/dashboard/analysis'),
            }
          ]
        },
        // {
        //   path: 'demo',
        //   name: '演示页',
        //   meta: {
        //     icon: 'file-ppt'
        //   },
        //   component: () => import('@/pages/demo')
        // },
        // {
        //   path: 'parent1',
        //   name: '父级路由1',
        //   meta: {
        //     icon: 'dashboard',
        //   },
        //   component: BlankView,
        //   children: [
        //     {
        //       path: 'demo1',
        //       name: '演示页面1',
        //       component: () => import('@/pages/demo'),
        //     }
        //   ]
        // },
        // {
        //   path: 'parent2',
        //   name: '父级路由2',
        //   meta: {
        //     icon: 'form'
        //   },
        //   component: PageView,
        //   children: [
        //     {
        //       path: 'demo2',
        //       name: '演示页面2',
        //       component: () => import('@/pages/demo'),
        //     }
        //   ]
        // },
        {
          path: 'exception',
          name: '异常页',
          meta: {
            icon: 'warning',
          },
          component: BlankView,
          children: [
            {
              path: '404',
              name: 'Exp404',
              component: () => import('@/pages/exception/404')
            },
            {
              path: '403',
              name: 'Exp403',
              component: () => import('@/pages/exception/403')
            },
            {
              path: '500',
              name: 'Exp500',
              component: () => import('@/pages/exception/500')
            }
          ]
        },
        {
          name: '验权页面',
          path: 'auth/demo',
          meta: {
            icon: 'file-ppt',
            authority: {
              permission: 'form',
              role: 'manager'
            },
            component: () => import('@/pages/demo')
          }
        },
        {
          path: 'article',
          name: '内容管理',
          meta: {
            icon: 'table'
          },
          component: PageView,
          children: [
            {
              path: 'categoryList',
              name: '分类管理',
              meta: {
                authority: 'AbpVnext.ArticleCategory',
              },
              component: () => import('@/pages/article/CategoryList'),
            },
            {
              path: 'articleList',
              name: '文章管理',
              component: () => import('@/pages/article/ArticleList'),
            }
          ]
        },
        {
          path: 'system',
          name: '系统管理',
          meta: {
            icon: 'setting'
          },
          component: PageView,
          children: [
            {
              path: 'role',
              name: '角色管理',
              meta: {
                authority: 'AbpIdentity.Roles',
              },
              component: () => import('@/pages/identity/RoleList'),
            },
            {
              path: 'user',
              name: '用户管理',
              meta: {
                authority: 'AbpIdentity.Users',
              },
              component: () => import('@/pages/identity/UserList'),
            },
            {
              path: 'tenant',
              name: '租户管理',
              meta: {
                authority: 'AbpTenantManagement.Tenants',
              },
              component: () => import('@/pages/multi-tenancy/TenantList'),
            },
            {
              path: 'auditLog',
              name: '审计日志',
              meta: {
                authority: 'AbpAuditLogging.Default',
              },
              component: () => import('@/pages/auditlogging/List'),
            },
            {
              path: 'organization',
              name: '组织单元',
              meta: {
                authority: 'AbpIdentity.OrganitaionUnits',
              },
              component: () => import('@/pages/identity/OrganizationList'),
            },
            {
              path: 'file',
              name: '文件管理',
              meta: {
                authority: 'EasyAbp.FileManagement.File',
              },
              component: () => import('@/pages/file-management/File')
            },
            {
              path: 'notification',
              name: '通知管理',
              meta: {
                authority: 'EasyAbp.NotificationService.Notification',
              },
              component: () => import('@/pages/notification/List')
            },
            {
              path: 'setting', 
              name: '设置',
              meta: {
                authority: 'EasyAbp.NotificationService.Notification',
              },
              component: () => import('@/pages/setting-management/Setting')
            },
          ]
        },
        {
          path: 'wechat-management',
          name: '微信管理',
          meta: {
            icon: 'table'
          },
          component: PageView,
          children: [
            {
              path: 'mini-program',
              name: '小程序管理',
              meta: {
                authority: 'EasyAbp.WeChatManagement.MiniPrograms.MiniProgram',
              },
              component: () => import('@/pages/wechat-management/MiniProgram'),
            }
          ]
        },
      ]
    }
  ]
}

export default options
