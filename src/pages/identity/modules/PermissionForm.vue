<template>
  <a-modal
    :title="'修改权限-' + permissionsQuery.providerKey"
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
            
            v-for="(group,index) in permissionData.groups"
            :key="index+1"
            :tab="group.displayName"
          >
            <a-form-model-item :label="group.displayName">
              <a-tree
                ref="permissionTree"
                v-model="group.value"
                checkable
                checkStrictly
                defaultExpandAll
                :treeData="transformPermissionTree(group.permissions)"
                :replaceFields="treeDefaultProps"
              />
            </a-form-model-item>
          </a-tab-pane>
        </a-tabs>
      </a-form-model>
    </a-spin>
  </a-modal>
</template>

<script>
import { get, createUpdate } from "@/services/permission-management/permissions";
let that;
export default {
  name: "PermissionForm",
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
      permissionsQuery: { providerKey: "", providerName: "" },
      permissionData: {
        groups: [],
      },
      treeDefaultProps: {
        children: "children",
        title: "label",
        key: "name",
      },
      // selectedPermissions:{
      //   "AbpIdentity":[],
      //   "FeatureManagement":[],
      //   "AbpTenantManagement":[],
      //   "EasyAbp.FileManagement":[],
      //   "AbpVnext":[],
      //   "AbpAuditLogging":[],
      // },
      // selectedPermissions: [
      //   [],[],[],[],[]
      // ],
    };
  },
  created() {
    that = this;
    this.permissionsQuery.providerName = this.providerName;
  },
  methods: {
    openModal(model) {
      this.visible = true;
      // this.form = model;
      if (this.permissionsQuery.providerName === "R") {
        this.permissionsQuery.providerKey = model.name;
      } else if (this.permissionsQuery.providerName === "U") {
        this.permissionsQuery.providerKey = model.id;
      }
      if (model && model.id) {
        this.getFormData(model.id);
      }
    },
    resetForm() {
      this.form = {};
    },
    getFormData() {
      this.confirmLoading = true;
      get(this.permissionsQuery)
        .then((res) => {
          // this.permissionData = res;
          for (const i in res.groups) {
            // let selectedPermissions = [];
            const keys = [];
            const group = res.groups[i];
            for (const j in group.permissions) {
              if (group.permissions[j].isGranted) {
                keys.push(group.permissions[j].name);
              }
            }
            group.value= {checked:keys||[]};
            // selectedPermissions = [...selectedPermissions, ...keys];
            // this.$nextTick(() => {
            //   that.selectedPermissions[group.name] = selectedPermissions||[];
            // });
          }
          this.permissionData = res;
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
          const tempData = [];
          for (const i in this.permissionData.groups) {
            
            const group = this.permissionData.groups[i];
            // const keys = that.selectedPermissions[group.name]||[];
            const keys = group.value.checked||[];
            for (const j in group.permissions) {
              if (
                group.permissions[j].isGranted &&
                !keys.some((v) => v === group.permissions[j].name)
              ) {
                tempData.push({
                  isGranted: false,
                  name: group.permissions[j].name,
                });
              } else if (
                !group.permissions[j].isGranted &&
                keys.some((v) => v === group.permissions[j].name)
              ) {
                tempData.push({
                  isGranted: true,
                  name: group.permissions[j].name,
                });
              }
            }
          }
          createUpdate(this.permissionsQuery, { permissions: tempData })
            .then((res) => {
              this.visible = false;
              form.resetFields();
              this.$message.info("操作成功");
              // this.$emit('ok')
            })
            .finally(() => {
              this.confirmLoading = false;
            });
        } else {
          this.confirmLoading = false;
        }
      });
    },
    transformPermissionTree(permissions, name = null) {
      const arr = [];
      if (!permissions || !permissions.some((v) => v.parentName === name)) {
        return arr;
      }

      const parents = permissions.filter((v) => v.parentName === name);
      for (const i in parents) {
        let label = "";
        if (this.permissionsQuery.providerName === "R") {
          label = parents[i].displayName;
        } else if (this.permissionsQuery.providerName === "U") {
          label =
            parents[i].displayName +
            " " +
            parents[i].grantedProviders.map((provider) => {
              return `${provider.providerName}: ${provider.providerKey}`;
            });
        }
        arr.push({
          name: parents[i].name,
          key: parents[i].name,
          label,
          disabled: this.isGrantedByOtherProviderName(
            parents[i].grantedProviders
          ),
          children: this.transformPermissionTree(permissions, parents[i].name),
        });
      }
      return arr;
    },
    isGrantedByOtherProviderName(grantedProviders) {
      if (grantedProviders.length) {
        return (
          grantedProviders.findIndex(
            (p) => p.providerName !== this.permissionsQuery.providerName
          ) > -1
        );
      }
      return false;
    },
  },
};
</script>

<style scoped>
</style>