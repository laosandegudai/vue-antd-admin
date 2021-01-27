<template>
  <a-card>
    <div>
      <div class="operator">
        <a-button v-if="checkPermission('AbpIdentity.Roles.Create')" @click="$refs.createModal.createOrEdit({})" type="primary"
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
        <div slot="action" slot-scope="{ record }">
          <template>
            <a-dropdown>
              <a class="ant-dropdown-link" href="#">
                操作
                <a-icon type="down" />
              </a>
              <a-menu slot="overlay">
                <a-menu-item v-if="checkPermission('AbpIdentity.Roles.Update')">
                  <a
                    href="javascript:;"
                    @click="$refs.createModal.createOrEdit(record)"
                    >编辑</a
                  >
                </a-menu-item>
                <a-menu-item v-if="checkPermission('AbpIdentity.Roles.ManagePermissions')">
                  <a href="javascript:;" @click="$refs.permissionModal.createOrEdit(record)">权限</a>
                </a-menu-item>
                <a-menu-item v-if="checkPermission('AbpIdentity.Roles.Delete')">
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
    <permission-form ref="permissionModal" provider-name="R"/>
  </a-card>
</template>

<script>
import StandardTable from "@/components/table/StandardTable";
import { getList, del } from "@/services/identity/role";
import CreateForm from "./modules/RoleForm";
import PermissionForm from "./modules/PermissionForm";
import { checkPermission } from '@/utils/abp';
const columns = [
  {
    title: "角色名称",
    dataIndex: "name",
    scopedSlots: { customRender: "roleName" },
  },
  {
    title: "操作",
    scopedSlots: { customRender: "action" },
  },
];
let that;
export default {
  name: "RoleList",
  components: { StandardTable, CreateForm,PermissionForm },
  data() {
    return {
      advanced: true,
      columns: columns,
      dataSource: [],
      selectedRows: [],
      pagination: {
        pageSize: 10,
        current: 1,
      },
      sorter: {
        field: "id",
        order: "desc",
      },
      loading: false,
      queryParam: {},
      categorys: [],
    };
  },
  // authorize: {
  //   deleteRecord: "delete",
  // },
  mounted() {
    that=this;
    this.loadData();
  },
  methods: {
    checkPermission,
    toggleAdvanced() {
      this.advanced = !this.advanced;
    },
    onSelectChange() {
      this.$message.info("选中行改变了");
    },
    handleDel(id) {
      del(id).then((res) => {
        this.loadData();
        this.$message.info("删除成功");
      });
    },
    handleOk() {
      this.loadData();
    },
    handleTableChange(pagination, filters, sorter) {
      const pager = { ...this.pagination };
      pager.current = pagination.current;
      this.pagination = pager;
      this.sorter = sorter;
      this.loadData();
    },
    loadData() {
      this.loading = true;
      let params = {
        ...this.pagination,
        ...this.queryParam,
        sorter: this.sorter,
      };
      getList(params)
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