<template>
  <a-modal
    title="连接字符串"
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
      <a-form-model-item >
        <a-checkbox
          v-model="useSharedDatabase"
        >
        使用共享数据库
        </a-checkbox>
      </a-form-model-item>
      <a-form-model-item
        v-if="!useSharedDatabase"
        label="默认连接字符串"
        prop="defaultConnectionString"
      >
        <a-input v-model="form.defaultConnectionString" />
      </a-form-model-item>
      </a-form-model>
    </a-spin>
  </a-modal>
</template>

<script>
import {
  getDefaultConnectionString,
  updateDefaultConnectionString,
  deleteDefaultConnectionString,
} from "@/services/multi-tenancy/tenant";
export default {
  name: "ConnectionstringForm",
  data() {
    return {
      labelCol: { span: 7 },
      wrapperCol: { span: 10 },
      visible: false,
      confirmLoading: false,
      form: {
        defaultConnectionString: "",
      },
      rules: {
      },
      useSharedDatabase: true,
    };
  },
  created() {},
  methods: {
    createOrEdit(model) {
      this.visible = true;
      // this.form = model;
      this.form.id=model.id;
      if (model && model.id) {
        this.getFormData(model.id);
      }
    },
    resetForm() {
      this.form = {
        defaultConnectionString: "",
      };
    },
    getFormData(id) {
      this.confirmLoading = true;
      getDefaultConnectionString(id)
        .then((response) => {
          if (response) {
            this.useSharedDatabase = false;
            this.form.defaultConnectionString = response;
          } else {
            this.useSharedDatabase = true;
          }
        })
        .finally(() => {
          this.confirmLoading = false;
        });
    },
    handleCancel() {
      this.visible = false;
      this.currentStep = 0;
    },
    handleOk() {
      const form = this.$refs.ruleForm;
      this.confirmLoading = true;
      console.log(this.useSharedDatabase,this.form.defaultConnectionString);
      form.validate((valid) => {
        if (valid) {
          let values = this.form;
          if (
            this.useSharedDatabase ||
            (!this.useSharedDatabase && !this.form.defaultConnectionString)
          ) {
            console.log("deleteDefaultConnectionString");
            deleteDefaultConnectionString(this.form.id).then(() => {
              this.visible = false;
              this.$message.info("操作成功");
            }).finally(() => {
              this.confirmLoading = false;
            });
          } else {
            console.log("updateDefaultConnectionString");
            updateDefaultConnectionString(this.form.id, this.form).then(() => {
              this.visible = false;
              this.$message.info("操作成功");
            }).finally(() => {
              this.confirmLoading = false;
            });
          }
        } else {
          this.confirmLoading = false;
        }
      });
    },
  },
};
</script>

<style scoped>
</style>