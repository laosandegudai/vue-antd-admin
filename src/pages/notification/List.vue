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
       
        <span slot="creationTime" slot-scope="{ text }">{{
          text | moment
        }}</span>
       
      </standard-table>
    </div>
    
  </a-card>
</template>

<script>
import StandardTable from "@/components/table/StandardTable";
import { getList} from "@/services/notification/notification";
import { checkPermission } from "@/utils/abp";
const columns = [
  {
    title: "用户ID",
    dataIndex: "userId",
  },
  {
    title: "消息通知ID",
    dataIndex: "notificationInfoId",
  },
  {
    title: "通知方式",
    dataIndex: "notificationMethod",
  },
  {
    title: "是否成功",
    dataIndex: "success",
  },
  {
    title: "完成时间",
    dataIndex: "completionTime",
    scopedSlots: { customRender: "creationTime" },
    sorter: true,
  },
  {
    title: "失败原因",
    dataIndex: "failureReason",
  },
  {
    title: "重试的通知ID",
    dataIndex: "retryNotificationId",
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