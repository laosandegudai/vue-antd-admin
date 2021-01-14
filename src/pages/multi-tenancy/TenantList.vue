<template>
  <a-card>
    <div>
      <div class="operator">
        <a-button @click="$refs.featureModal.createOrEdit({})" type="primary"
          >管理Host特性</a-button
        >
        <a-button @click="$refs.createModal.createOrEdit({})" type="primary"
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
        <div slot="action" slot-scope="{ record }">
          <template>
            <a-dropdown>
              <a class="ant-dropdown-link" href="#">
                操作
                <a-icon type="down" />
              </a>
              <a-menu slot="overlay">
                <a-menu-item>
                  <a
                    href="javascript:;"
                    @click="$refs.createModal.createOrEdit(record)"
                    >编辑</a
                  >
                </a-menu-item>
                <a-menu-item>
                  <a href="javascript:;" @click="$refs.connectionstringModal.createOrEdit(record)">链接字符串</a>
                </a-menu-item>
                <a-menu-item>
                  <a href="javascript:;" @click="$refs.featureModal.createOrEdit(record)">功能</a>
                </a-menu-item>
                <a-menu-item>
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
    <connectionstring-form ref="connectionstringModal" />
    <feature-form ref="featureModal" provider-name="T" />
  </a-card>
</template>

<script>
import StandardTable from "@/components/table/StandardTable";
import { getList, del } from "@/services/multi-tenancy/tenant";
import CreateForm from "./modules/TenantForm";
import ConnectionstringForm from "./modules/ConnectionstringForm";
import FeatureForm from "./modules/FeatureForm";
const columns = [
  {
    title: "租户名称",
    dataIndex: "name",
  },
  {
    title: "操作",
    scopedSlots: { customRender: "action" },
  },
];
let that;
export default {
  name: "TenantList",
  components: { StandardTable, CreateForm,ConnectionstringForm,FeatureForm },
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
      // this.sorter = sorter;
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