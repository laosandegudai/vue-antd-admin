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
          @click="$refs.createModal.openModal({})"
          icon="plus"
          type="primary"
          >新建</a-button
        >
        <a-button
          v-if="checkPermission('AbpVnext.Article.Create')"
          type="primary"
          icon="import"
          @click="$refs.articleImportModal.openModal()"
        >
          导入
        </a-button>
        <a-button type="primary" icon="export" @click="exportExcel">
          导出
        </a-button>
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
        <a-dropdown>
          <a-button icon="printer" type="primary">
            打印选项
            <a-icon type="down" />
          </a-button>
          <a-menu slot="overlay">
            <a-menu-item type="primary" @click="printInfo(0)"
              >直接打印</a-menu-item
            >
            <a-menu-item type="primary" @click="printInfo(1)"
              >打印预览</a-menu-item
            >
            <a-menu-item type="primary" @click="printInfo(2)"
              >打印维护</a-menu-item
            >
            <a-menu-item type="primary" @click="printInfo(3)"
              >打印设计</a-menu-item
            >
          </a-menu>
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
        <a-avatar
          slot="img"
          slot-scope="{ text }"
          shape="square"
          :src="`${baseURL}/api/file-management/file/${text}/getFile`"
        />
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
                    @click="$refs.createModal.openModal(record)"
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
    <import-modal ref="articleImportModal" @ok="loadData" />
    <device-tag ref="deviceTag" @ok="loadData" />
    <div id="olstyle1">
      .assets-tag{ display: none; text-align: center; } .assets-tag
      table,tr,th,td{ border:1px solid #000; } .assets-tag th{ text-align:
      center; font-size: 24px; } .assets-tag .lable{ width: 80px; } .assets-tag
      .text{ width: 200px; }
    </div>
  </a-card>
</template>

<script>
import StandardTable from "@/components/table/StandardTable";
import { getList, del, dels, exportExcel } from "@/services/article";
import CreateForm from "./modules/ArticleForm";
import { getTrees as getCategorys } from "@/services/articleCategory";
import { checkPermission } from "@/utils/abp";
import ImportModal from "./modules/ArticleImportModal";
import { getLodop } from "@/utils/LodopFuncs.js";
import DeviceTag from "@/components/module/device/deviceTag";
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
    fixed: "right",
  },
];
let that;
export default {
  name: "ArticleList",
  components: { StandardTable, CreateForm, ImportModal, DeviceTag },
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
      } else if (e.key === "print") {
        this.printInfo();
      }
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
    exportExcel() {
      let params = {
        ...this.queryParam,
        sorter: this.sorter,
      };
      exportExcel(params);
    },
    //以下为临时测试打印
    // 打印
    handleReview(index, row) {
      this.getPrintData(row.printUrl);
    },
    // 获取面单信息数组数据
    async getPrintData(url) {
      if (url) {
        this.printUrlList = url.split(";");
        this.printInfo();
      }
    },
    // 打印面单
    async printInfo(s) {
      for await (const item of this.selectedRows) {
        this.printEveryItem(item, s);
      }
    },
    // 打印每项
    printEveryItem(item, s) {
      let LODOP = getLodop(); //调用getLodop获取LODOP对象
      return new Promise(function (resolve) {
        setTimeout(() => {
          LODOP.PRINT_INIT("");
          console.log(that.$refs.deviceTag);
          var olstyle1 =
        "<style>" + document.getElementById("olstyle1") + "</style>";
          // let strStyleCSS = `<style type='text/css' rel='stylesheet'>.img1{display:block;margin:10px;width:360;height:360}</style>`;
          let html = `<head>${olstyle1}</head><body>${that.$refs.deviceTag.$el.innerHTML}<body>`;

          LODOP.ADD_PRINT_HTM(0, 0, 380, 380, html);
          LODOP.SET_PRINT_PAGESIZE(1, 1000, 1000, "");
          if (s == 0) {
            LODOP.PRINT(); //直接打印
          }
          if (s == 1) {
            LODOP.PREVIEW(); //打印预览
          }
          if (s == 2) {
            LODOP.PRINT_SETUP(); //打印维护
          }
          if (s == 3) {
            LODOP.PRINT_DESIGN(); //打印设计
          }
        }, 1000);
      });
    },
    printPreview(s) {
      let selectedRowKeys = this.selectedRows.map((x) => x.id);
      for (const item of selectedRowKeys) {
        this.CreateOneFormPage(s);
      }
    },
    CreateOneFormPage(s) {
      LODOP = getLodop();
      //样式
      var olstyle1 =
        "<style>" + document.getElementById("olstyle1") + "</style>";
      var body =
        olstyle1 + "<body>" + that.$refs.deviceTag.$el.innerHTML + "</body>";
      LODOP.PRINT_INIT("订单"); //打印初始化
      LODOP.SET_PRINT_STYLE("FontSize", 18); //设置对象风格
      LODOP.SET_PRINT_STYLE("Bold", 1); //设置对象风格
      LODOP.ADD_PRINT_TEXT(50, 521, 130, 39, this.description); //增加纯文本项
      LODOP.SET_PRINT_PAGESIZE(0, 2000, 2000, ""); //设定纸张大小
      LODOP.SET_PRINT_MODE("PRINT_PAGE_PERCENT", "55%"); //设置缩放
      LODOP.SET_PREVIEW_WINDOW(2, 2, 0, 0, 0, ""); //设置窗口
      // 打印二维码
      // LODOP.ADD_PRINT_BARCODE(23,23,233,233,"QRCode","https://blog.csdn.net/qq_43652509");
      //打印网址
      // LODOP.ADD_PRINT_URL(222,2000,2000,233,"https://blog.csdn.net/qq_43652509");
      //打印图片
      // LODOP.ADD_PRINT_IMAGE(100,100,400,400,"<img border='0' src='http://s1.sinaimg.cn/middle/4fe4ba17hb5afe2caa990&690' width='345' height='250'>");
      LODOP.ADD_PRINT_HTM(88, 20, 2000, 2000, body); //增加超文本项
      if (s == 0) {
        LODOP.PRINT(); //直接打印
      }
      if (s == 1) {
        LODOP.PREVIEW(); //打印预览
      }
      if (s == 2) {
        LODOP.PRINT_SETUP(); //打印维护
      }
      if (s == 3) {
        LODOP.PRINT_DESIGN(); //打印设计
      }
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