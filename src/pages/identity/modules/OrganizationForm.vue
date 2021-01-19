<template>
  <a-modal
    :title="form.id ? '修改组织单元' : '添加组织单元'"
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
        <a-form-model-item v-if="currentParentName!==''" label="上级名称">
          <a-input
            v-model="currentParentName"
            disabled
            placeholder="请输入上级名称"
          />
        </a-form-model-item>
        <a-form-model-item label="名称">
          <a-input
            v-model="form.displayName"
            placeholder="请输入名称"
          />
        </a-form-model-item>
      </a-form-model>
    </a-spin>
  </a-modal>
</template>

<script>
import { getOrganizationSingle as get,edit } from "@/services/identity/organization";
export default {
  data() {
    return {
      labelCol: { span: 7 },
      wrapperCol: { span: 10 },
      visible: false,
      confirmLoading: false,
      form: {
        displayName: "",
        parentId: "",
        displayOrder: 0,
      },
      rules: {
        displayName: [
          { required: true, message: "分类名称必须填写", trigger: "blur" },
        ],
      },
      categorys: [],
      replaceFields:{children:'children', title:'displayName', key:'id',value:'id' },
      currentParentName:''
    };
  },
  created() {
  },
  methods: {
    createOrEdit(model,currentParentName){
      this.visible = true;
      this.form = model;
      if(model && model.id){
        this.getFormData(model.id);
      }
      if(currentParentName){
        this.currentParentName = currentParentName
      }
      else{
        this.currentParentName = ''
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
          edit(values)
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