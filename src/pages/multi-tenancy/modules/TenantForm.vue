<template>
  <a-modal
    :title="form.id ? '修改租户' : '添加租户'"
    :width="640"
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
        <a-form-model-item label="租户名称" ref="name" prop="name">
          <a-input
            v-model="form.name"
            placeholder="请输入租户名称"
            @blur="
              () => {
                $refs.name.onFieldBlur();
              }
            "
          />
        </a-form-model-item>
        <a-form-model-item v-if="!form.id" label="管理员邮箱" ref="adminEmailAddress" prop="adminEmailAddress">
          <a-input
            v-model="form.adminEmailAddress"
            placeholder="请输入管理员邮箱"
            @blur="
              () => {
                $refs.adminEmailAddress.onFieldBlur();
              }
            "
          />
        </a-form-model-item>
        <a-form-model-item v-if="!form.id" label="管理员密码" ref="adminPassword" prop="adminPassword">
          <a-input
            v-model="form.adminPassword"
            placeholder="请输入管理员密码"
            @blur="
              () => {
                $refs.adminPassword.onFieldBlur();
              }
            "
          />
        </a-form-model-item>
      </a-form-model>
    </a-spin>
  </a-modal>
</template>

<script>
import { get,createUpdate } from "@/services/multi-tenancy/tenant";
export default {
  name: "TenantForm",
  data() {
    return {
      labelCol: { span: 7 },
      wrapperCol: { span: 10 },
      visible: false,
      confirmLoading: false,
      form: {},
      rules: {
        name: [
          { required: true, message: "租户名称必须填写", trigger: "blur" },
        ],
        adminEmailAddress: [
          { required: true, message: "管理员邮箱必须填写", trigger: "blur" },
        ],
        adminPassword: [
          { required: true, message: "管理员必须填写", trigger: "blur" },
        ],
      },
    };
  },
  created() {
  },
  methods: {
    openModal(model){
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
          createUpdate(values)
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

<style scoped>
</style>