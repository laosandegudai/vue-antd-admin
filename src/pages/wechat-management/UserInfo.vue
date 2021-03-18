<template>
  <a-card>
    
    <div>
      
      <standard-table
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :selectedRows.sync="selectedRows"
        @change="handleTableChange"
        :pagination="pagination"
        :loading="loading"
      >
       
        <a-avatar slot="img" slot-scope="{ text }"  shape="square" :src="text" />
        
      </standard-table>
    </div>
    
  </a-card>
</template>

<script>
import StandardTable from "@/components/table/StandardTable";
import { getList} from "@/services/wechat-management/user-info";
import { checkPermission } from "@/utils/abp";

const columns = [
  {
    title: "用户ID",
    dataIndex: "userId",
  },
  {
    title: "昵称",
    dataIndex: "nickName",
  },
  {
    title: "性别",
    dataIndex: "gender",
  },
  {
    title: "客户端语言",
    dataIndex: "language",
  },
  {
    title: "城市",
    dataIndex: "city",
  },
  {
    title: "省份",
    dataIndex: "province",
  },
  {
    title: "国家",
    dataIndex: "country",
  },
  {
    title: "头像图片",
    dataIndex: "avatarUrl",
    scopedSlots: { customRender: "img" },
  },
];
let that;
export default {
  components: { StandardTable},
  data() {
    return {
      advanced: true,
      columns: columns,
      dataSource: [],
      selectedRows: [],
      pagination: {
        pageSize: 10,
        current: 1,
        showQuickJumper:true,
        showTotal:total => `总计 ${total} 条`
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