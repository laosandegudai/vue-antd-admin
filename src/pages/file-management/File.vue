<template>
  <a-card>
    <div :class="advanced ? 'search' : null">
      <a-form layout="horizontal">
        <div :class="advanced ? null : 'fold'">
          <a-row>
            <a-col :md="8" :sm="24">
              <a-form-item
                label="容器名"
                :labelCol="{ span: 5 }"
                :wrapperCol="{ span: 18, offset: 1 }"
              >
                <a-input
                  v-model="queryParam.fileContainerName"
                  placeholder="请输入"
                />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item
                label="所有者"
                :labelCol="{ span: 5 }"
                :wrapperCol="{ span: 18, offset: 1 }"
              >
                <a-select
                  show-search
                  v-model="queryParam.ownerUserId"
                  placeholder="请选择"
                  style="width: 200px"
                  :default-active-first-option="false"
                  :show-arrow="false"
                  :filter-option="false"
                  :not-found-content="null"
                  @search="userSearch"
                  @change="userChange"
                >
                  <a-select-option v-for="d in users" :key="d.id">
                    {{ d.name }}
                  </a-select-option>
                </a-select>
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
          v-if="checkPermission('EasyAbp.FileManagement.File.Create')"
          @click="
            $refs.createModal.createOrEdit({
              fileContainerName: queryParam.fileContainerName,
              ownerUserId: queryParam.ownerUserId,
              parentId: queryParam.parentId,
            })
          "
          icon="plus"
          type="primary"
          >创建目录</a-button
        >
        <a-button
          v-if="checkPermission('EasyAbp.FileManagement.File.Create')"
          @click="
            $refs.uploadModal.createOrEdit({
              fileContainerName: queryParam.fileContainerName,
              ownerUserId: queryParam.ownerUserId,
              parentId: queryParam.parentId,
            })
          "
          icon="plus"
          type="primary"
          >上传</a-button
        >
        <a-dropdown v-if="selectedRows.length > 0">
          <a-menu @click="handleMenuClick" slot="overlay">
            <a-menu-item v-if="checkPermission('EasyAbp.FileManagement.File.Delete')" key="delete">删除</a-menu-item>
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
        <div slot="fileName" slot-scope="{ record }">
          <span
            style="color: #007bff"
            v-if="record.fileType == 1"
            @click="getDirectory(record.id)"
          >
            <a-icon type="folder" /> {{ record.fileName }}</span
          >
          <span v-if="record.fileType == 2">
            <a-icon type="file" /> {{ record.fileName }}</span
          >
        </div>
        <span slot="byteSize" slot-scope="{ text }">{{
          humanFileSize(text, true)
        }}</span>
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
                <!-- <a-menu-item>
                  <a href="javascript:;">重命名</a>
                </a-menu-item>
                <a-menu-item>
                  <a href="javascript:;">移动</a>
                </a-menu-item> -->
                <a-menu-item v-if="checkPermission('EasyAbp.FileManagement.File.GetDownloadInfo')&&record.fileType==2">
                  <a href="javascript:;" @click="download(record.id)">下载</a>
                </a-menu-item>
                <!-- <a-menu-item v-if="record.fileType==2">
                  <a href="javascript:;">重新上传</a>
                </a-menu-item> -->
                <a-menu-item v-if="checkPermission('EasyAbp.FileManagement.File.Delete')">
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
    <create-directory-modal ref="createModal" @ok="loadData" />
    <upload-modal ref="uploadModal" @ok="loadData" />
  </a-card>
</template>

<script>
import StandardTable from "@/components/table/StandardTable";
import { getList, del, getDownloadInfo } from "@/services/file-management/file";
import CreateDirectoryModal from "./modules/CreateDirectoryModal";
import UploadModal from "./modules/UploadModal";
import { getList as getUsers } from "@/services/identity/user";
import { mapGetters } from "vuex";
import { checkPermission } from '@/utils/abp';
const columns = [
  {
    title: "文件名",
    dataIndex: "fileName",
    scopedSlots: { customRender: "fileName" },
  },
  {
    title: "文件大小",
    dataIndex: "byteSize",
    scopedSlots: { customRender: "byteSize" },
  },
  {
    title: "创建时间",
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
  components: { StandardTable, CreateDirectoryModal, UploadModal },
  computed: {
    ...mapGetters("account", ["user"]),
  },
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
        order: "asc",
      },
      loading: false,
      queryParam: {
        fileContainerName: "default",
        ownerUserId: null,
        parentId: null,
      },
      users: [],
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
    this.queryParam.ownerUserId = this.user.id;
    this.loadData();
    this.getUsers();
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
      // if (e.key === "delete") {
      //   let selectedRowKeys = this.selectedRows.map((x) => x.id);
      //   if (selectedRowKeys.length == 0) {
      //     this.$message.warning("请选择要删除的行");
      //   }
      //   this.$confirm({
      //     title: "确定要删除吗?",
      //     okType: "danger",
      //     onOk() {
      //       dels(selectedRowKeys).then((res) => {
      //         that.loadData();
      //         that.$message.info("删除成功");
      //       });
      //     },
      //   });
      // }
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
    getUsers(filter) {
      getUsers({ skipCount: 0, maxResultCount: 10, filter: filter }).then(
        (res) => {
          this.users = res.items;
        }
      );
    },
    userSearch(value) {
      this.getUsers(value);
    },
    userChange(value) {
      console.log(value);
      this.queryParam.ownerUserId = value;
    },
    getDirectory(parentId) {
      this.queryParam.parentId = parentId;
      this.refresh();
    },
    humanFileSize(bytes, si = false, dp = 1) {
      const thresh = si ? 1000 : 1024;
      if (Math.abs(bytes) < thresh) {
        return bytes + " B";
      }
      const units = si
        ? ["kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]
        : ["KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"];
      let u = -1;
      const r = Math.pow(10, dp);
      do {
        bytes /= thresh;
        ++u;
      } while (
        Math.round(Math.abs(bytes) * r) / r >= thresh &&
        u < units.length - 1
      );
      return bytes.toFixed(dp) + " " + units[u];
    },
    download(id) {
      getDownloadInfo(id).then((res) => {
        const a = document.createElement("a");
        a.download = res.expectedFileName;
        a.href = res.downloadUrl.replace(/fileManagement/, "file-management");
        a.click();
        a.remove();
      });
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
  button {
    margin-right: 5px;
  }
}
@media screen and (max-width: 900px) {
  .fold {
    width: 100%;
  }
}
</style>