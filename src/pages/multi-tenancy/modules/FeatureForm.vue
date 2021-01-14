<template>
  <a-modal
    title="功能"
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
        <a-tabs tab-position="left">
          <a-tab-pane
            forceRender
            v-for="(group, index) in featuresData.groups"
            :key="index + 1"
            :tab="group.displayName"
          >
            <a-form-model-item
              v-for="feature in group.features"
              :key="feature.name"
              :label="feature.displayName"
            >
              <a-select
                v-model="feature.value"
              >
                <a-select-option v-for="(item,index) in feature.valueType.itemSource.items" :key="index" :value="item.value"> {{$t(item.displayText.name)}} </a-select-option>
              </a-select>
            </a-form-model-item>
            <aside v-if="!group.features || group.features.length == 0">没有可用的功能.</aside>
          </a-tab-pane>
        </a-tabs>
        <!-- <a-form-model-item
          v-for="feature in features"
          :key="feature.name"
          :label="feature.name"
        >
          <el-checkbox
            v-if="feature.valueType.name === 'ToggleStringValueType'"
            v-model="form[feature.name]"
          />
          <el-input
            v-else-if="feature.valueType.name === 'FreeTextStringValueType'"
            v-model="form[feature.name]"
          />
        </a-form-model-item>

        <aside v-if="!features || features.length == 0">没有可用的功能.</aside> -->
      </a-form-model>
    </a-spin>
  </a-modal>
</template>

<script>
import {
  getFeatures,
  updateFeatures,
} from "@/services/feature-management/features";
export default {
  name: "FeatureForm",
  i18n: require('../i18n'),
  props: {
    providerName: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      labelCol: { span: 7 },
      wrapperCol: { span: 10 },
      visible: false,
      confirmLoading: false,
      form: {},
      rules: {},
      features: "",
      featuresQuery: { providerKey: "", providerName: "" },
      featuresData: [],
    };
  },
  created() {
    this.featuresQuery.providerName = this.providerName;
  },
  methods: {
    createOrEdit(model) {
      this.visible = true;
      this.form = model;
      this.featuresQuery.providerKey = model.id;
      if (model) {
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
      getFeatures(this.featuresQuery)
        .then((response) => {
          // this.features = response.features;
          this.featuresData = response;
          // this.features.map((feature) => {
          //   if (feature.valueType.name === "ToggleStringValueType") {
          //     this.$set(this.form, feature.name, feature.value === "true");
          //   } else if (feature.valueType.name === "FreeTextStringValueType") {
          //     this.$set(this.form, feature.name, feature.value);
          //   }
          // });
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
          const tempData = { features: [] };
          this.featuresData.groups.map(x=>{
            x.features.map(feature=>{
              tempData.features.push({
                name: feature.name,
                value: feature.value,
              });
            });
          });
          // this.features.map((feature) => {
          //   if (feature.valueType.name === "ToggleStringValueType") {
          //     tempData.features.push({
          //       name: feature.name,
          //       value: this.form[feature.name] ? true : null,
          //     });
          //   } else if (feature.valueType.name === "FreeTextStringValueType") {
          //     tempData.features.push({
          //       name: feature.name,
          //       value: this.form[feature.name],
          //     });
          //   }
          // });

          updateFeatures(this.featuresQuery, tempData)
            .then(() => {
              this.visible = false;
              this.$message.info("操作成功");
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