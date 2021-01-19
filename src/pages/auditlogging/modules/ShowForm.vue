<template>
  <div class="audit-log-container">
    <a-modal
      title="详情"
      :width="800"
      :visible="visible"
      :confirmLoading="confirmLoading"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <a-spin :spinning="confirmLoading">
        <a-tabs default-active-key="1">
          <a-tab-pane key="1" tab="请求信息">
            <detail-list size="small" :col="1">
              <detail-list-item term="状态码">{{
                form.httpStatusCode
              }}</detail-list-item>
              <detail-list-item term="请求方法">{{
                form.httpMethod
              }}</detail-list-item>
              <detail-list-item term="请求地址">{{
                form.url
              }}</detail-list-item>
              <detail-list-item term="客户端IP">{{
                form.clientIpAddress
              }}</detail-list-item>
              <detail-list-item term="客户端名称">{{
                form.clientName
              }}</detail-list-item>
              <detail-list-item term="用户名称">{{
                form.userName
              }}</detail-list-item>
              <detail-list-item term="请求时间">{{
                form.executionTime | moment
              }}</detail-list-item>
              <detail-list-item term="耗时(毫秒)"
                >{{ form.executionDuration }}ms</detail-list-item
              >
              <detail-list-item term="浏览器信息">{{
                form.browserInfo
              }}</detail-list-item>
              <detail-list-item term="异常信息">{{
                form.exceptions
              }}</detail-list-item>
              <detail-list-item term="comments">{{
                form.comments
              }}</detail-list-item>
              <detail-list-item term="扩展信息">{{
                form.extraProperties
              }}</detail-list-item>
            </detail-list>
          </a-tab-pane>
          <a-tab-pane key="2" tab="请求方法">
            <a-collapse v-if="form.actions && form.actions.length > 0">
              <a-collapse-panel
                v-for="action in form.actions"
                :key="action.id"
                :header="action.serviceName"
              >
                <detail-list size="small" :col="1">
                  <detail-list-item term="方法名称">{{
                    action.methodName
                  }}</detail-list-item>

                  <detail-list-item term="请求时间">{{
                    action.executionTime | moment
                  }}</detail-list-item>
                  <detail-list-item term="耗时(毫秒)">{{
                    action.executionDuration
                  }}</detail-list-item>
                  <detail-list-item term="请求参数"
                    ><span>{{ action.parameters }}</span>
                    <a-button
                      type="primary"
                      round
                      size="small"
                      icon="a-icon-document"
                      @click="handleCopyParameters(action.parameters, $event)"
                    >
                      复制
                    </a-button></detail-list-item
                  >
                  <detail-list-item term="扩展信息">{{
                    action.extraProperties
                  }}</detail-list-item>
                </detail-list>
              </a-collapse-panel>
            </a-collapse>
            <p v-else>没有</p>
          </a-tab-pane>
          <a-tab-pane key="3" tab="实体更改">
            <a-collapse
              v-if="form.entityChanges && form.entityChanges.length > 0"
            >
              <a-collapse-panel
                v-for="entity in form.entityChanges"
                :key="entity.id"
                :header="entity.entityTypeFullName"
              >
                <detail-list size="small" :col="1">
                  <detail-list-item term="实体名称">{{
                    action.entityTypeFullName
                  }}</detail-list-item>
                  <detail-list-item term="更改类型">{{
                    action.changeType
                  }}</detail-list-item>
                  <detail-list-item term="更改类型">{{
                    action.changeTime | moment
                  }}</detail-list-item>
                  <detail-list-item term="实体ID">{{
                    action.entityId
                  }}</detail-list-item>
                  <detail-list-item term="扩展信息">{{
                    action.extraProperties
                  }}</detail-list-item>
                </detail-list>
              </a-collapse-panel>
            </a-collapse>
            <p v-else>没有</p>
          </a-tab-pane>
        </a-tabs>
      </a-spin>
    </a-modal>
  </div>
</template>

<script>
import { getAuditLog as get } from "@/services/auditlogging/auditlog";
import clip from "@/utils/clipboard";
import DetailList from "@/components/tool/DetailList";
const DetailListItem = DetailList.Item;
export default {
  components: { DetailList, DetailListItem },
  data() {
    return {
      labelCol: { span: 7 },
      wrapperCol: { span: 10 },
      visible: false,
      confirmLoading: false,
      form: {},
      rules: {
        title: [{ required: true, message: "标题必须填写", trigger: "blur" }],
        // categoryId: [
        //   { required: true, message: "请选择类别", trigger: "change" },
        // ],
      },
    };
  },
  created() {},
  methods: {
    show(model) {
      this.visible = true;
      this.form = model;
      if (model && model.id) {
        this.getFormData(model.id);
      }
    },
    resetForm() {
      this.form = {};
    },
    getFormData(id) {
      this.confirmLoading = true;
      get(id)
        .then((res) => {
          this.form = {
            ...res,
          };
        })
        .finally(() => {
          this.confirmLoading = false;
        });
    },
    handleCancel() {
      this.visible = false;
      this.currentStep = 0;
    },
    handleOk() {},
    handleCopyParameters(text, event) {
      clip(text, event);
    },
  },
};
</script>

<style lang="less" scoped>
.audit-log-container {
  .logInfo {
    border-collapse: collapse;
    border-spacing: 2px;
    tr {
      border: 1px solid #f0f0f0;
      th {
        background-color: #fafafa;
        width: 120px;
      }
      th,
      td {
        text-align: left;
        text-overflow: ellipsis;
        vertical-align: middle;
        box-sizing: border-box;
        border-right: #f0f0f0;
        height: inherit;
        padding: 8px 16px;
      }
    }
  }
}
</style>