<template>
  <a-modal
    :title="form.id ? '修改文章分类' : '添加文章分类'"
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
        <a-form-model-item
          label="分类名称"
          ref="displayName"
          prop="displayName"
        >
          <a-input
            v-model="form.displayName"
            placeholder="请输入分类名称"
            @blur="
              () => {
                $refs.displayName.onFieldBlur();
              }
            "
          />
        </a-form-model-item>
        <a-form-model-item label="父级" prop="parentId">
          <a-tree-select
            v-model="form.parentId"
            style="width: 100%"
            :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
            :tree-data="categorys"
            :replaceFields="replaceFields"
            placeholder="请选择"
            tree-default-expand-all
          >
          </a-tree-select>
        </a-form-model-item>
        <a-form-model-item label="图标" prop="iconId">
          <upload-img v-model="form.iconId" :maxCount="1"></upload-img>
        </a-form-model-item>
        <a-form-model-item label="排序" help="数字，越小越向前">
          <a-input-number v-model="form.displayOrder" />
        </a-form-model-item>
      </a-form-model>
    </a-spin>
  </a-modal>
</template>

<script>
import { get, getTrees, createUpdate } from "@/services/articleCategory";
import UploadImg from '@/components/uploadImg/UploadImg'
export default {
  name: "CategoryForm",
  components: {
    UploadImg
  },
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
      replaceFields: {
        children: "children",
        title: "displayName",
        key: "id",
        value: "id",
      },
    };
  },
  created() {},
  methods: {
    openModal(model) {
      this.getCategorys();
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
    getCategorys() {
      getTrees().then((res) => {
        this.categorys = res;
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
          let values = this.form;
          createUpdate(values)
            .then((res) => {
              this.visible = false;
              form.resetFields();
              this.$message.info("操作成功");
              this.$emit("ok");
            })
            .finally(() => {
              this.confirmLoading = false;
            });
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