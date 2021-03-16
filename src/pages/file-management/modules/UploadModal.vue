<template>
  <a-modal
    title="上传"
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
        <a-form-model-item>
          <a-upload-dragger
            name="uploadedFiles"
            :multiple="true"
            :file-list="fileList"
            :remove="handleRemove"
            :before-upload="beforeUpload"
          >
            <p class="ant-upload-drag-icon">
              <a-icon type="inbox" />
            </p>
            <p class="ant-upload-text">单击或拖动文件到此区域以上载</p>
            <p class="ant-upload-hint">支持单次或批量上传</p>
          </a-upload-dragger>
        </a-form-model-item>
      </a-form-model>
    </a-spin>
  </a-modal>
</template>

<script>
import { get, manyCreate } from "@/services/file-management/file";
export default {
  data() {
    return {
      labelCol: { span: 7 },
      wrapperCol: { span: 10 },
      visible: false,
      confirmLoading: false,
      form: {},
      rules: {},
      baseURL: process.env.VUE_APP_API_BASE_URL,
      fileList: [],
      uploading: false,
    };
  },
  created() {},
  methods: {
    openModal(model) {
      this.visible = true;
      this.form = model;
      if (model && model.id) {
        this.getFormData(model.id);
      }
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
    handleOk() {
      const form = this.$refs.ruleForm;
      this.confirmLoading = true;
      form.validate((valid) => {
        if (valid) {
          const { fileList } = this;
          const formData = new FormData();
          fileList.forEach((file) => {
            formData.append("files", file);
          });
          formData.append("fileContainerName",this.form.fileContainerName);
          formData.append("ownerUserId",this.form.ownerUserId);
          formData.append("parentId",this.form.parentId||'');
          formData.append("fileType",2);
          this.uploading = true;
          manyCreate(formData)
            .then((res) => {
              this.visible = false;
              form.resetFields();
              this.$message.info("操作成功");
              this.$emit("ok");
            })
            .finally(() => {
              this.uploading = false;
              this.confirmLoading = false;
            });
        } else {
          this.confirmLoading = false;
        }
      });
    },
    handleRemove(file) {
      const index = this.fileList.indexOf(file);
      const newFileList = this.fileList.slice();
      newFileList.splice(index, 1);
      this.fileList = newFileList;
    },
    beforeUpload(file) {
      this.fileList = [...this.fileList, file];
      return false;
    },
  },
};
</script>

<style scoped>
</style>