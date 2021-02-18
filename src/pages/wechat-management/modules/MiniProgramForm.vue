<template>
  <a-modal
    :title="form.id ? '修改小程序账号' : '添加小程序账号'"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form-model
        ref="ruleForm"
        :model="form"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-model-item label="微信第三方平台 ID" prop="weChatComponentId">
          <a-input
            v-model="form.weChatComponentId"
            placeholder="通过微信第三方平台管理则必填"
          />
        </a-form-model-item>
        <a-form-model-item label="内置名称" prop="name">
          <a-input
            v-model="form.name"
          />
        </a-form-model-item>
        <a-form-model-item label="展示名称" prop="displayName">
          <a-input
            v-model="form.displayName"
          />
        </a-form-model-item>
        <a-form-model-item label="开放平台 AppId (或名称)" prop="openAppIdOrName">
          <a-input
            v-model="form.openAppIdOrName"
          />
        </a-form-model-item>
        <a-form-model-item label="AppId" prop="appId">
          <a-input
            v-model="form.appId"
          />
        </a-form-model-item>
        <a-form-model-item label="AppSecret" prop="appSecret" >
          <a-input
            v-model="form.appSecret"
            placeholder="留空则通过第三方平台管理"
          />
        </a-form-model-item>
        <a-form-model-item label="Token" prop="token">
          <a-input
            v-model="form.token"
          />
        </a-form-model-item>
        <a-form-model-item label="EncodingAesKey" prop="encodingAesKey">
          <a-input
            v-model="form.encodingAesKey"
          />
        </a-form-model-item>
      </a-form-model>
    </a-spin>
  </a-modal>
</template>

<script>
import { get,createOrUpdate } from "@/services/wechat-management/mini-program";
export default {
  data() {
    return {
      labelCol: { span: 7 },
      wrapperCol: { span: 10 },
      visible: false,
      confirmLoading: false,
      form: {},
      rules: {
        name: [{ required: true, message: "内置名称必须填写", trigger: "blur" }],
        displayName: [{ required: true, message: "展示名称必须填写", trigger: "blur" }],
        openAppIdOrName: [{ required: true, message: "开放平台 AppId (或名称)必须填写", trigger: "blur" }],
        appId: [{ required: true, message: "AppId必须填写", trigger: "blur" }],
      },
    };
  },
  created() {

  },
  methods: {
    createOrEdit(model){
      this.visible = true;
      this.form = model;
      if(model && model.id){
        this.getFormData(model.id);
      }
    },
    resetForm() {
      this.form = {};
    },
    getFormData(id) {
      this.confirmLoading = true;
      get(id).then((res) => {
        this.form = {
          ...res,
        };
      }).finally(()=>{
        this.confirmLoading = false
      });
    },
    handleCancel() {
      this.visible = false
      this.currentStep = 0
    },
    handleOk() {
      const form = this.$refs.ruleForm;
      this.confirmLoading = true;
      form.validate((valid) => {
        if (valid) {
          let values = this.form;
          createOrUpdate(values)
            .then((res) => {
              this.visible = false;
              form.resetFields();
              this.$message.info("操作成功");
              this.$emit('ok')
            })
            .finally(() => {
              this.confirmLoading = false;
            });
        } else {
          this.confirmLoading = false;
        }
      });
    }
  },
  
};
</script>

