<template>
  <a-card :bordered="false">
    <a-spin :spinning="confirmLoading">
      <a-tabs tab-position="left">
        <a-tab-pane
          forceRender
          v-for="(group, index) in settingData"
          :key="index + 1"
          :tab="group.groupDisplayName"
        >
          <template v-for="(setGroup, gindex) in group.settingInfos">
            <a-card :key="gindex" :title="$t(setGroup[0].properties.Group2)">
              <a-form
                :form="forms[index + '_' + gindex]"
                :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }"
                @submit="handleSubmit(index + '_' + gindex, $event)"
              >
                <a-form-item
                  v-for="settingInfo in setGroup"
                  :key="settingInfo.name"
                  :label="$t(settingInfo.displayName)"
                >
                  <a-select
                    v-if="settingInfo.properties.Type === 'select'"
                    v-decorator="[
                      settingInfo.name,
                      { initialValue: settingInfo.value },
                    ]"
                    :placeholder="settingInfo.description"
                  >
                    <a-select-option
                      v-for="(
                        item, index
                      ) in settingInfo.properties.Options.split('|')"
                      :key="index"
                      :value="item"
                    >
                      {{ $t(item) }}
                    </a-select-option>
                  </a-select>
                  <a-checkbox
                    v-if="settingInfo.properties.Type === 'checkbox'"
                    v-decorator="[
                      settingInfo.name,
                      {
                        valuePropName: 'checked',
                        initialValue: settingInfo.value,
                      },
                    ]"
                    :placeholder="settingInfo.description"
                  />
                  <a-input
                    v-if="settingInfo.properties.Type === 'text'"
                    v-decorator="[
                      settingInfo.name,
                      { initialValue: settingInfo.value },
                    ]"
                    :placeholder="settingInfo.description"
                  />
                  <a-input-number
                    v-if="settingInfo.properties.Type === 'number'"
                    v-decorator="[
                      settingInfo.name,
                      { initialValue: settingInfo.value },
                    ]"
                    :placeholder="settingInfo.description"
                  />
                </a-form-item>
                <a-form-item :wrapper-col="{ span: 14, offset: 20 }">
                  <a-button
                    type="danger"
                    @click="resetSetting(index + '_' + gindex)"
                  >
                    重置
                  </a-button>
                  <a-button
                    style="margin-left: 10px"
                    type="primary"
                    html-type="submit"
                  >
                    保存
                  </a-button>
                </a-form-item>
              </a-form>
            </a-card>
          </template>
        </a-tab-pane>
      </a-tabs>
    </a-spin>
  </a-card>
</template>

<script>
import {
  setSettingValues,
  resetSettingValues,
  get,
} from "@/services/setting-management/setting";
let that;
export default {
  i18n: require('./i18n'),
  data() {
    return {
      labelCol: { span: 7 },
      wrapperCol: { span: 10 },
      visible: false,
      confirmLoading: false,
      form: {},
      rules: {},
      features: "",
      forms: {},
      settingData: [],
    };
  },
  created() {
    that = this;
    this.getFormData();
  },
  methods: {
    resetForm() {
      this.form = {
        defaultConnectionString: "",
      };
    },
    getFormData() {
      this.confirmLoading = true;
      get()
        .then((response) => {
          response.map((x, index) => {
            x.settingInfos.map((settingInfo, gindex) => {
              if (settingInfo.properties.Type === "checkbox") {
                settingInfo.value = settingInfo.value === "true" ? true : false;
              }
              settingInfo.name = settingInfo.name.replace(/\./g, "_");
              that.forms[index + "_" + gindex] = that.$form.createForm(that);
            });
            x.settingInfos = that.groupBy(x.settingInfos, function (item) {
              return [item.properties.Group2];
            });
          });
          this.settingData = response;
          console.log(this.settingData);
        })
        .finally(() => {
          this.confirmLoading = false;
        });
    },
    handleCancel() {
      this.visible = false;
      this.currentStep = 0;
    },
    handleSubmit(index, e) {
      e.preventDefault();
      this.forms[index].validateFields((err, values) => {
        if (!err) {
          let newValue = {};
          for (let key in values) {
            let newKey = "setting_" + key;
            newValue[newKey] = values[key].toString();
          }
          that.confirmLoading = true;
          setSettingValues(newValue)
            .then(() => {
              that.visible = false;
              that.$message.info("操作成功");
            })
            .finally(() => {
              that.confirmLoading = false;
            });
        }
      });
    },
    resetSetting(index) {
      that.$confirm({
        title: "确定要重置为默认值吗?",
        okType: "danger",
        onOk() {
          that.forms[index].validateFields((err, values) => {
            if (!err) {
              let newValue = [];
              let i=0;
              for (let key in values) {
                let newKey = key.replace(/_/g, ".");
                newValue[i] = newKey;
                i++;
              }
              that.confirmLoading = true;
              resetSettingValues(newValue)
                .then(() => {
                  that.visible = false;
                  that.$message.info("操作成功");
                  that.getFormData();
                })
                .finally(() => {
                  that.confirmLoading = false;
                });
            }
          });
        },
      });
    },
    groupBy(array, f) {
      let groups = {};
      array.forEach(function (o) {
        let group = JSON.stringify(f(o));
        groups[group] = groups[group] || [];
        groups[group].push(o);
      });
      return Object.keys(groups).map(function (group) {
        return groups[group];
      });
    },
  },
};
</script>

<style scoped>
</style>