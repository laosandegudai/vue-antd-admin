<template>
  <a-card>
    <div :class="advanced ? 'search' : null">
      <a-form layout="horizontal">
        <div :class="advanced ? null : 'fold'">
          <a-row>
            <a-col :md="8" :sm="24">
              <a-form-item
                label="标题"
                :labelCol="{ span: 5 }"
                :wrapperCol="{ span: 18, offset: 1 }"
              >
                <a-input v-model="queryParam.filter" placeholder="请输入" />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item
                label="类别"
                :labelCol="{ span: 5 }"
                :wrapperCol="{ span: 18, offset: 1 }"
              >
                <a-tree-select
                  v-model="queryParam.categoryId"
                  style="width: 100%"
                  :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                  :tree-data="categorys"
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
          v-if="checkPermission('AbpVnext.Article.Create')"
          @click="$refs.createModal.createOrEdit({})"
          icon="plus"
          type="primary"
          >新建</a-button
        >
        <a-button v-if="checkPermission('AbpVnext.Article.Create')" type="primary" icon="import" @click="$refs.articleImportModal.createOrEdit()"> 导入 </a-button>
        <a-button type="primary" icon="export" @click="exportExcel"> 导出 </a-button>
        <a-dropdown v-if="selectedRows.length > 0">
          <a-menu @click="handleMenuClick" slot="overlay">
            <a-menu-item
              v-if="checkPermission('AbpVnext.Article.Delete')"
              key="delete"
              >删除</a-menu-item
            >
          </a-menu>
          <a-button> 批量操作 <a-icon type="down" /> </a-button>
        </a-dropdown>
        
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
        <span slot="categoryName" slot-scope="{ record }">{{
          record.category ? record.category.displayName : ""
        }}</span>
        <span slot="creationTime" slot-scope="{ text }">{{
          text | moment
        }}</span>
        <a-avatar slot="img" slot-scope="{ text }"  shape="square" :src="`${baseURL}/api/file-management/file/${text}/getFile`" />
        <div slot="action" slot-scope="{ record }">
          <template>
            <a-dropdown>
              <a class="ant-dropdown-link" href="#">
                操作
                <a-icon type="down" />
              </a>
              <a-menu slot="overlay">
                <a-menu-item v-if="checkPermission('AbpVnext.Article.Update')">
                  <a
                    href="javascript:;"
                    @click="$refs.createModal.createOrEdit(record)"
                    >编辑</a
                  >
                </a-menu-item>
                <a-menu-item v-if="checkPermission('AbpVnext.Article.Delete')">
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
    <article-import-modal ref="articleImportModal" @ok="loadData" />
  </a-card>
</template>

<script>
import StandardTable from "@/components/table/StandardTable";
import { getList, del, dels,exportExcel } from "@/services/article";
import CreateForm from "./modules/ArticleForm";
import { getTrees as getCategorys } from "@/services/articleCategory";
import { checkPermission } from "@/utils/abp";
import ArticleImportModal from "./modules/ArticleImportModal";
const columns = [
  {
    title: "标题",
    dataIndex: "title",
  },
  {
    title: "封面图",
    dataIndex: "imgId",
    scopedSlots: { customRender: "img" },
  },
  {
    title: "所属类别",
    dataIndex: "categoryName",
    scopedSlots: { customRender: "categoryName" },
  },
  {
    title: "排序",
    dataIndex: "displayOrder",
    sorter: true,
  },
  {
    title: "发布时间",
    dataIndex: "creationTime",
    scopedSlots: { customRender: "creationTime" },
    sorter: true,
  },
  {
    title: "操作",
    scopedSlots: { customRender: "action" },
  },
];
let that;
export default {
  name: "ArticleList",
  components: { StandardTable, CreateForm,ArticleImportModal },
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
        field: "displayOrder",
        order: "asc",
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
    this.getCategorys();
    console.log("permissions", this.permissions);
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
    handleMenuClick(e) {
      if (e.key === "delete") {
        let selectedRowKeys = this.selectedRows.map((x) => x.id);
        if (selectedRowKeys.length == 0) {
          this.$message.warning("请选择要删除的行");
        }
        this.$confirm({
          title: "确定要删除吗?",
          okType: "danger",
          onOk() {
            dels(selectedRowKeys).then((res) => {
              that.loadData();
              that.$message.info("删除成功");
            });
          },
        });
      }
    },
    handleTableChange(pagination, filters, sorter) {
      const pager = { ...this.pagination };
      pager.current = pagination.current;
      this.pagination = pager;
      if(sorter.field) this.sorter = sorter;
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
    getCategorys() {
      getCategorys().then((res) => {
        this.categorys = res;
      });
    },
    exportExcel(){
      let params = {
        ...this.queryParam,
        sorter: this.sorter,
      };
      exportExcel(params);
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