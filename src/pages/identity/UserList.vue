<template>
  <a-card>
    <div :class="advanced ? 'search' : null">
      <a-form layout="horizontal">
        <div :class="advanced ? null : 'fold'">
          <a-row>
            <a-col :md="8" :sm="24">
              <a-form-item
                label="搜索"
                :labelCol="{ span: 5 }"
                :wrapperCol="{ span: 18, offset: 1 }"
              >
                <a-input
                  v-model="queryParam.filter"
                  placeholder="用户名/邮箱/姓名/手机号"
                />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item
                label="角色"
                :labelCol="{ span: 5 }"
                :wrapperCol="{ span: 18, offset: 1 }"
              >
                <a-select
                  v-model="queryParam.roleId"
                  allowClear	
                  @change="handleChange"
                >
                  <a-select-option v-for="r in roles" :key="r.id" :value="r.id">
                    {{ r.name }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item
                label="组织单元"
                :labelCol="{ span: 5 }"
                :wrapperCol="{ span: 18, offset: 1 }"
              >
                <a-tree-select
                  v-model="queryParam.organizationUnitId"
                  style="width: 100%"
                  :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                  :tree-data="organizations"
                  :replaceFields="replaceFields"
                  placeholder="请选择"
                  tree-default-expand-all
                  allowClear
                >
                </a-tree-select>
              </a-form-item>
            </a-col>
          </a-row>
        </div>
        <span style="float: right; margin-top: 3px">
          <a-button type="primary" @click="refresh">查询</a-button>
          <a-button
            style="margin-left: 8px"
            @click="() => (this.queryParam = {})"
            >重置</a-button
          >
        </span>
      </a-form>
    </div>
    <div>
      <div class="operator">
        <a-button
          v-if="checkPermission('AbpIdentity.Users.Create')"
          @click="$refs.createModal.openModal({})"
          type="primary"
          >新建</a-button
        >
      </div>
      <standard-table
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :selectedRows.sync="selectedRows"
        @change="handleTableChange"
        :pagination="pagination"
        :loading="loading"
      >
        <span slot="roleName" slot-scope="{ text, record }">
          {{ text }}
          <a-tag color="red" v-if="record.isStatic">系统</a-tag>
          <a-tag color="blue" v-if="record.isDefault">默认</a-tag>
          <a-tag color="blue" v-if="record.isPublic">公开</a-tag>
        </span>
        <span slot="sex" slot-scope="{ text }">{{ text.Sex | sexFilter }}</span>
        <div slot="action" slot-scope="{ record }">
          <template>
            <a-dropdown>
              <a class="ant-dropdown-link" href="#">
                操作
                <a-icon type="down" />
              </a>
              <a-menu slot="overlay">
                <a-menu-item v-if="checkPermission('AbpIdentity.Users.Update')">
                  <a
                    href="javascript:;"
                    @click="$refs.createModal.openModal(record)"
                    >编辑</a
                  >
                </a-menu-item>
                <a-menu-item
                  v-if="checkPermission('AbpIdentity.Users.ManagePermissions')"
                >
                  <a
                    href="javascript:;"
                    @click="$refs.permissionModal.openModal(record)"
                    >权限</a
                  >
                </a-menu-item>
                <a-menu-item v-if="checkPermission('AbpIdentity.Users.Delete')">
                  <a-popconfirm
                    title="确定要删除吗？"
                    @confirm="handleDel(record.id)"
                  >
                    <a href="javascript:;">删除</a>
                  </a-popconfirm>
                </a-menu-item>
              </a-menu>
            </a-dropdown>
          </template>
        </div>
      </standard-table>
    </div>
    <create-form ref="createModal" @ok="handleOk" />
    <permission-form ref="permissionModal" provider-name="U" />
  </a-card>
</template>

<script>
import StandardTable from "@/components/table/StandardTable";
import { getListWithDetails, del } from "@/services/identity/user";
import { getAll } from "@/services/identity/role";
import { getOrganizationsAll } from "@/services/identity/organization";
import CreateForm from "./modules/UserForm";
import PermissionForm from "./modules/PermissionForm";
import { checkPermission } from "@/utils/abp";
const columns = [
  {
    title: "用户名称",
    dataIndex: "userName",
  },
  {
    title: "姓",
    dataIndex: "surname",
  },
  {
    title: "名称",
    dataIndex: "name",
  },
  {
    title: "邮箱地址",
    dataIndex: "email",
  },
  {
    title: "手机号",
    dataIndex: "phoneNumber",
  },
  {
    title: "性别",
    dataIndex: "extraProperties",
    scopedSlots: { customRender: "sex" },
  },
  {
    title: "操作",
    scopedSlots: { customRender: "action" },
  },
];
const sexMap = {
  0: {
    name: "Unknown",
    text: "未知",
  },
  1: {
    name: "Man",
    text: "男",
  },
  2: {
    name: "Woman",
    text: "女",
  },
};
let that;
export default {
  name: "UserList",
  components: { StandardTable, CreateForm, PermissionForm },
  data() {
    return {
      advanced: true,
      columns: columns,
      dataSource: [],
      selectedRows: [],
      pagination: {
        pageSize: 10,
        current: 1,
        showQuickJumper: true,
        showTotal: (total) => `总计 ${total} 条`,
      },
      sorter: {
        field: "id",
        order: "desc",
      },
      loading: false,
      queryParam: {},
      roles: [],
      organizations: [],
      replaceFields: {
        children: "children",
        title: "displayName",
        key: "id",
        value: "id",
      },
    };
  },
  // authorize: {
  //   deleteRecord: "delete",
  // },
  mounted() {
    that = this;
    this.loadData();
    this.getRoles();
    this.getOrganizations();
  },
  filters: {
    sexFilter(key) {
      if (!key) {
        return "";
      }
      return sexMap[key].text;
    },
  },
  methods: {
    checkPermission,
    toggleAdvanced() {
      this.advanced = !this.advanced;
    },
    onSelectChange() {
      this.$message.info("选中行改变了");
    },
    handleOk() {
      this.loadData();
    },
    handleTableChange(pagination, filters, sorter) {
      const pager = { ...this.pagination };
      pager.current = pagination.current;
      this.pagination = pager;
      if (sorter.field) this.sorter = sorter;
      this.loadData();
    },
    loadData() {
      this.loading = true;
      let params = {
        ...this.pagination,
        ...this.queryParam,
        sorter: this.sorter,
      };
      getListWithDetails(params)
        .then((res) => {
          const pagination = { ...this.pagination };
          pagination.total = res.totalCount;
          this.pagination = pagination;
          this.dataSource = res.items;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    refresh() {
      this.pagination.current = 1;
      this.loadData();
    },
    getRoles() {
      getAll().then((res) => {
        this.roles = res.items;
      });
    },
    getOrganizations(){
      getOrganizationsAll().then((res) => {
        this.organizations = res.items;
      });
    }
  },
};
</script>

<style lang="less" scoped>
.search {
  margin-bottom: 54px;
}
.fold {
  width: calc(100% - 216px);
  display: inline-block;
}
.operator {
  margin-bottom: 18px;
}
@media screen and (max-width: 900px) {
  .fold {
    width: 100%;
  }
}
</style>