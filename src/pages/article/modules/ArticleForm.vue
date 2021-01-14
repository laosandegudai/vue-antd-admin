<template>
  <a-modal
    :title="form.id ? '修改文章' : '添加文章'"
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
        <a-form-model-item label="所属类别" prop="categoryId">
          <a-tree-select
            v-model="form.categoryId"
            style="width: 100%"
            :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
            :tree-data="categorys"
            :replaceFields="replaceFields"
            placeholder="请选择"
            tree-default-expand-all
          >
          </a-tree-select>
        </a-form-model-item>
        <a-form-model-item label="标题" ref="title" prop="title">
          <a-input
            v-model="form.title"
            placeholder="请输入标题"
            @blur="
              () => {
                $refs.title.onFieldBlur();
              }
            "
          />
        </a-form-model-item>
        <a-form-model-item label="标签" help="多个可用英文逗号分隔开，如：a,b">
          <template v-for="(tag, index) in tags">
            <a-tooltip v-if="tag.length > 20" :key="tag" :title="tag">
              <a-tag
                :key="tag"
                :closable="index !== 0"
                @close="() => handleClose(tag)"
              >
                {{ `${tag.slice(0, 20)}...` }}
              </a-tag>
            </a-tooltip>
            <a-tag
              v-else
              :key="tag"
              :closable="true"
              @close="() => handleClose(tag)"
            >
              {{ tag }}
            </a-tag>
          </template>
          <a-input
            v-if="inputVisible"
            ref="input"
            type="text"
            size="small"
            :style="{ width: '78px' }"
            :value="inputValue"
            @change="handleInputChange"
            @blur="handleInputConfirm"
            @keyup.enter="handleInputConfirm"
          />
          <a-tag
            v-else
            style="background: #fff; borderstyle: dashed"
            @click="showInput"
          >
            <a-icon type="plus" /> 添加
          </a-tag>
        </a-form-model-item>
        <a-form-model-item label="排序" help="数字，越小越向前">
          <a-input-number v-model="form.displayOrder" />
        </a-form-model-item>
        <a-form-model-item label="浏览次数" help="点击浏览该信息自动+1">
          <a-input-number v-model="form.viewCount" />
        </a-form-model-item>
        <a-form-model-item label="发布时间" help="不选择默认当前发布时间">
          <a-date-picker v-model="form.creationTime" show-time />
        </a-form-model-item>
      </a-form-model>
    </a-spin>
  </a-modal>
</template>

<script>
import { get,edit } from "@/services/article";
import { getList as getCategorys } from "@/services/articleCategory";
export default {
  name: "ArticleForm",
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
      categorys: [],
      replaceFields:{children:'children', title:'displayName', key:'id',value:'id' },
      tags: [],
      inputVisible: false,
      inputValue: ''
    };
  },
  created() {
    this.getCategorys();
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
    getCategorys() {
      getCategorys().then((res) => {
        this.categorys = res.items;
      });
    },
    handleClose(removedTag) {
      const tags = this.tags.filter(tag => tag !== removedTag);
      this.tags = tags;
    },

    showInput() {
      this.inputVisible = true;
      this.$nextTick(function() {
        this.$refs.input.focus();
      });
    },

    handleInputChange(e) {
      this.inputValue = e.target.value;
    },

    handleInputConfirm() {
      const inputValue = this.inputValue;
      let tags = this.tags;
      if (inputValue && tags.indexOf(inputValue) === -1) {
        tags = [...tags, inputValue];
      }
      Object.assign(this, {
        tags,
        inputVisible: false,
        inputValue: '',
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