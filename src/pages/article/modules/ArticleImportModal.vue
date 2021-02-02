<template>
  <a-modal
    title="导入"
    :width="640"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <p @click="generateTemplate">下载导入模板</p>
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
            :file-list="fileList"
            :remove="handleRemove"
            :before-upload="beforeUpload"
          >
            <p class="ant-upload-drag-icon">
              <a-icon type="inbox" />
            </p>
            <p class="ant-upload-text">单击或拖动文件到此区域以上载</p>
          </a-upload-dragger>
        </a-form-model-item>
      </a-form-model>
      <a-table
        v-if="templateErrors.length > 0"
        :columns="columns"
        :data-source="templateErrors"
        :rowKey="(record,index)=>{return index}"
      ></a-table>
    </a-spin>
  </a-modal>
</template>

<script>
import { generateTemplate, importExcel } from "@/services/article";
const columns = [
  {
    title: "列名",
    dataIndex: "columnName",
  },
  {
    title: "错误级别",
    dataIndex: "errorLevel",
  },
  {
    title: "消息",
    dataIndex: "message",
  },
  {
    title: "必填列",
    dataIndex: "requireColumnName",
  },
];
export default {
  data() {
    return {
      labelCol: { span: 7 },
      wrapperCol: { span: 15 },
      visible: false,
      confirmLoading: false,
      form: {},
      rules: {},
      baseURL: process.env.VUE_APP_API_BASE_URL,
      fileList: [],
      uploading: false,
      templateErrors: [],
      columns,
    };
  },
  created() {},
  methods: {
    createOrEdit() {
      this.visible = true;
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
            formData.append("file", file);
          });
          this.uploading = true;
          importExcel(formData)
            .then((res) => {
              if (!res.hasError && res.templateErrors.length == 0) {
                this.visible = false;
                form.resetFields();
                this.$message.info("操作成功");
                this.$emit("ok");
                return;
              }
              this.handleImportRes(res);
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
    handleImportRes(res) {
      this.templateErrors = res.templateErrors;
      if (res.hasError) {
        this.$confirm({
          title: "导入数据存在校验错误",
          content:
            "不用担心，我们已在校验错误处加了标注，您可以根据错误标注修改后重新上传，是否要下载",
          onOk() {
            let downloadInfo = res.errorFile.downloadInfo;
            const a = document.createElement("a");
            a.download = downloadInfo.expectedFileName;
            a.href = downloadInfo.downloadUrl;
            a.click();
            a.remove();
          },
        });
      }
    },
    handleRemove(file) {
      const index = this.fileList.indexOf(file);
      const newFileList = this.fileList.slice();
      newFileList.splice(index, 1);
      this.fileList = newFileList;
    },
    beforeUpload(file) {
      this.fileList = [file];
      return false;
    },
    generateTemplate() {
      generateTemplate();
    },
  },
};
</script>

<style scoped>
</style>