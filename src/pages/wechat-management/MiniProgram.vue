<template>
  <a-card>
    
    <div>
      <div class="operator">
        <a-button
          v-if="checkPermission('EasyAbp.WeChatManagement.MiniPrograms.MiniProgram.Create')"
          @click="$refs.createModal.createOrEdit({})"
          icon="plus"
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
       
        <span slot="creationTime" slot-scope="{ text }">{{
          text | moment
        }}</span>
        <div slot="action" slot-scope="{ record }">
          <template>
            <a-dropdown>
              <a class="ant-dropdown-link" href="#">
                操作
                <a-icon type="down" />
              </a>
              <a-menu slot="overlay">
                <a-menu-item v-if="checkPermission('EasyAbp.WeChatManagement.MiniPrograms.MiniProgram.Update')">
                  <a
                    href="javascript:;"
                    @click="$refs.createModal.createOrEdit(record)"
                    >编辑</a
                  >
                </a-menu-item>
                <a-menu-item v-if="checkPermission('EasyAbp.WeChatManagement.MiniPrograms.MiniProgram.Delete')">
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
  </a-card>
</template>

<script>
import StandardTable from "@/components/table/StandardTable";
import { getList,del} from "@/services/wechat-management/mini-program";
import { checkPermission } from "@/utils/abp";
import CreateForm from "./modules/MiniProgramForm";
const columns = [
  {
    title: "微信第三方平台ID",
    dataIndex: "weChatComponentId",
  },
  {
    title: "内置名称",
    dataIndex: "name",
  },
  {
    title: "展示名称",
    dataIndex: "displayName",
  },
  {
    title: "开放平台 AppId (或名称)",
    dataIndex: "openAppIdOrName",
  },
  {
    title: "AppId",
    dataIndex: "appId",
  },
  {
    title: "是否静态",
    dataIndex: "isStatic",
  },
  {
    title: "操作",
    scopedSlots: { customRender: "action" },
  },
];
let that;
export default {
  components: { StandardTable,CreateForm},
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
      replaceFields: {
        children: "children",
        title: "displayName",
        key: "id",
        value: "id",
      },
      baseURL: process.env.VUE_APP_API_BASE_URL,
    };
  },
  // authorize: {
  //   deleteRecord: "delete",
  // },
  mounted() {
    that = this;
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
    handleDel(id) {
      del(id).then((res) => {
        this.loadData();
        this.$message.info("删除成功");
      });
    },
    handleOk() {
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