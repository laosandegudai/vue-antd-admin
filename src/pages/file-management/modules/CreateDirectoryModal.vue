<template>
  <a-modal
    title="创建目录"
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
        <a-form-model-item label="目录名称">
          <a-input
            v-model="form.directoryName"
            placeholder="请输入"
          />
        </a-form-model-item>
      </a-form-model>
    </a-spin>
  </a-modal>
</template>

<script>
import { get,createDirectory } from "@/services/file-management/file";
export default {
  data() {
    return {
      labelCol: { span: 7 },
      wrapperCol: { span: 10 },
      visible: false,
      confirmLoading: false,
      form: {
      },
      rules: {
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
          createDirectory(values)
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