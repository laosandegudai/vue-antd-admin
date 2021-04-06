<template>
  <a-modal
    :title="form.id ? '修改数据字典' : '添加数据字典'"
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
        <a-form-model-item label="编码" prop="code">
          <a-input
            v-model="form.code"
          />
        </a-form-model-item>
        <a-form-model-item label="显示文本" prop="displayText">
          <a-input
            v-model="form.displayText"
          />
        </a-form-model-item>
        <a-form-model-item label="描述" prop="description">
          <a-input
            v-model="form.description"
          />
        </a-form-model-item>
        
        <a-card title="字典值" :bordered="false">
          <data-dictionary-item ref="dataDictionaryItem" v-model="form.items"></data-dictionary-item>
        </a-card>
      </a-form-model>
    </a-spin>
  </a-modal>
</template>

<script>
import { get,createOrUpdate } from "@/services/data-dictionary/data-dictionary";
import DataDictionaryItem from './DataDictionaryItem'
export default {
  components: {
    DataDictionaryItem,
  },
  data() {
    return {
      labelCol: { span: 7 },
      wrapperCol: { span: 10 },
      visible: false,
      confirmLoading: false,
      form: {},
      rules: {
        // name: [{ required: true, message: "内置名称必须填写", trigger: "blur" }],
        // displayName: [{ required: true, message: "展示名称必须填写", trigger: "blur" }],
        // openAppIdOrName: [{ required: true, message: "开放平台 AppId (或名称)必须填写", trigger: "blur" }],
        // appId: [{ required: true, message: "AppId必须填写", trigger: "blur" }],
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
          values.items = this.$refs.dataDictionaryItem.getDataList();
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

