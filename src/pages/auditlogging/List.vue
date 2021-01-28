<template>
  <a-card>
    <div :class="advanced ? 'search' : null">
      <a-form layout="horizontal">
        <div :class="advanced ? null : 'fold'">
          <a-row>
            <a-col :md="8" :sm="24">
              <a-form-item
                label="请求地址"
                :labelCol="{ span: 5 }"
                :wrapperCol="{ span: 18, offset: 1 }"
              >
                <a-input v-model="queryParam.url" placeholder="请输入" />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item
                label="请求方法"
                :labelCol="{ span: 5 }"
                :wrapperCol="{ span: 18, offset: 1 }"
              >
                <a-select v-model="queryParam.httpMethod" allowClear>
                  <a-select-option value="GET"> 获取(GET) </a-select-option>
                  <a-select-option value="PUT"> 修改(PUT) </a-select-option>
                  <a-select-option value="POST"> 提交(POST) </a-select-option>
                  <a-select-option value="DELETE">
                    删除(DELETE)
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item
                label="用户名称"
                :labelCol="{ span: 5 }"
                :wrapperCol="{ span: 18, offset: 1 }"
              >
                <a-input v-model="queryParam.userName" placeholder="请输入" />
              </a-form-item>
            </a-col>
            
          </a-row>
          <a-row v-if="advanced">
            <a-col :md="8" :sm="24">
              <a-form-item
                label="租户名称"
                :labelCol="{ span: 5 }"
                :wrapperCol="{ span: 18, offset: 1 }"
              >
                <a-input v-model="queryParam.tenantName" placeholder="请输入" />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item
                label="客户端IP"
                :labelCol="{ span: 5 }"
                :wrapperCol="{ span: 18, offset: 1 }"
              >
                <a-input
                  v-model="queryParam.clientIpAddress"
                  placeholder="请输入"
                />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item
                label="状态码"
                :labelCol="{ span: 5 }"
                :wrapperCol="{ span: 18, offset: 1 }"
              >
                <a-select v-model="queryParam.httpStatusCode" allowClear>
                  <a-select-option value="200"> 成功(200) </a-select-option>
                  <a-select-option value="401"> 未登录(401) </a-select-option>
                  <a-select-option value="403"> 未授权(403) </a-select-option>
                  <a-select-option value="404">
                    未找到资源(404)
                  </a-select-option>
                  <a-select-option value="500"> 异常(500) </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item
                label="耗时(毫秒)"
                :labelCol="{ span: 5 }"
                :wrapperCol="{ span: 18, offset: 1 }"
              >
                <a-input
                  v-model="queryParam.executionDuration"
                  placeholder="请输入"
                />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item
                label="服务名称"
                :labelCol="{ span: 5 }"
                :wrapperCol="{ span: 18, offset: 1 }"
              >
                <a-input
                  v-model="queryParam.applicationName"
                  placeholder="请输入"
                />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item
                label="日期"
                :labelCol="{ span: 5 }"
                :wrapperCol="{ span: 18, offset: 1 }"
              >
              <a-range-picker v-model="queryDateTime" />
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
          <a @click="toggleAdvanced" style="margin-left: 8px">
            {{advanced ? '收起' : '展开'}}
            <a-icon :type="advanced ? 'up' : 'down'" />
          </a>
        </span>
      </a-form>
    </div>
    <div>
      <div class="operator">
        <a-dropdown v-if="selectedRows.length > 0">
          <a-menu @click="handleMenuClick" slot="overlay">
            <a-menu-item key="delete">删除</a-menu-item>
          </a-menu>
          <a-button> 批量操作 <a-icon type="down" /> </a-button>
        </a-dropdown>
        <a-button type="primary" icon="export" @click="exportExcel"> 导出 </a-button>
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
        <div slot="RequestInfo" slot-scope="{ record }">
          <a-tag :color="record.httpStatusCode | requestStatusCode">
            {{ record.httpStatusCode }}
          </a-tag>
          <a-tag :color="record.httpMethod | requestMethodFilter">
            {{ record.httpMethod }}
          </a-tag>
          <a-tag
            effect="dark"
            :color="record.executionDuration | requestDurationFilter"
          >
            {{ record.executionDuration }}S
          </a-tag>
          <p class="api-block" :class="record.httpMethod | requestMethodFilter">
            {{ record.url }}
          </p>
        </div>
        <template slot="empty" slot-scope="{ text }">
          <span>{{ text | empty }}</span>
        </template>
        <span slot="moment" slot-scope="{ text }">{{ text | moment }}</span>
        <div slot="action" slot-scope="{ record }">
          <template>
            <a-dropdown>
              <a class="ant-dropdown-link" href="#">
                操作
                <a-icon type="down" />
              </a>
              <a-menu slot="overlay">
                <a-menu-item>
                  <a href="javascript:;" @click="$refs.showModal.show(record)"
                    >查看</a
                  >
                </a-menu-item>
                <!-- <a-menu-item>
                  <a-popconfirm
                    title="确定要删除吗？"
                    @confirm="handleDel(record.id)"
                  >
                    <a href="javascript:;">删除</a>
                  </a-popconfirm>
                </a-menu-item> -->
              </a-menu>
            </a-dropdown>
          </template>
        </div>
      </standard-table>
    </div>
    <show-form ref="showModal" @ok="handleOk" />
  </a-card>
</template>

<script>
import StandardTable from "@/components/table/StandardTable";
import {
  getAuditLogs as getList,
  deleteAuditLog as del,
  deleteManyAuditLog as dels,
  exportExcel
} from "@/services/auditlogging/auditlog";
import ShowForm from "./modules/ShowForm";
import moment from 'moment'
const columns = [
  {
    title: "状态码 | 方法 | 耗时(毫秒) | 地址",
    dataIndex: "RequestInfo",
    scopedSlots: { customRender: "RequestInfo" },
  },
  {
    title: "用户名称",
    dataIndex: "userName",
    scopedSlots: { customRender: "empty" },
  },
  {
    title: "租户名称",
    dataIndex: "tenantName",
    scopedSlots: { customRender: "empty" },
  },
  {
    title: "请求时间",
    dataIndex: "executionTime",
    scopedSlots: { customRender: "moment" },
    sorter: true,
  },
  {
    title: "服务名称",
    dataIndex: "applicationName",
    scopedSlots: { customRender: "empty" },
  },
  {
    title: "客户端IP",
    dataIndex: "clientIpAddress",
    scopedSlots: { customRender: "empty" },
  },
  {
    title: "操作",
    scopedSlots: { customRender: "action" },
  },
];
let that;
export default {
  components: { StandardTable, ShowForm },
  data() {
    return {
      advanced: false,
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
      queryDateTime: undefined,
      queryParam: {},
    };
  },
  // authorize: {
  //   deleteRecord: "delete",
  // },
  mounted() {
    that = this;
    this.loadData();
  },
  filters: {
    requestDurationFilter(duration) {
      let type = "green";
      if (duration > 2 * 1000) {
        type = "orange";
      } else if (duration > 5 * 1000) {
        type = "red";
      }
      return type;
    },
    requestStatusCode(code) {
      let type = "green";
      switch (code) {
        case 401:
        case 403:
        case 404:
          type = "orange";
          break;
        case 500:
          type = "red";
          break;
      }
      return type;
    },
    requestMethodFilter(method) {
      let type = "green";
      switch (method.toUpperCase()) {
        case "GET":
          type = "";
          break;
        case "PUT":
          type = "orange";
          break;
        case "POST":
          type = "green";
          break;
        case "DELETE":
          type = "red";
          break;
        default:
          type = "blue";
      }
      return type;
    },
  },
  methods: {
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
      this.sorter = sorter;
      this.loadData();
    },
    loadData() {
      this.loading = true;
      if (this.queryDateTime) {
        this.queryParam.startTime =moment(this.queryDateTime[0]).format('YYYY-MM-DD HH:mm:ss'); 
        this.queryParam.endTime = moment(this.queryDateTime[1]).format('YYYY-MM-DD HH:mm:ss'); 
      }
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