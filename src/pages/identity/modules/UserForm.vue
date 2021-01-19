<template>
  <a-modal
    :title="form.id ? '修改用户' : '添加用户'"
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
        <a-tabs tab-position="top">
          <a-tab-pane key="1" tab="用户信息">
            <a-form-model-item label="用户名" ref="userName" prop="userName">
              <a-input
                v-model="form.userName"
                placeholder="请输入角色名称"
                @blur="
                  () => {
                    $refs.userName.onFieldBlur();
                  }
                "
              />
            </a-form-model-item>
            <a-form-model-item label="名">
              <a-input v-model="form.name" />
            </a-form-model-item>
            <a-form-model-item label="姓">
              <a-input v-model="form.surname" />
            </a-form-model-item>
            <a-form-model-item
              label="密码"
              ref="password"
              prop="password"
              :required="!form.id"
            >
              <a-input
                v-model="form.password"
                type="password"
                @blur="
                  () => {
                    $refs.password.onFieldBlur();
                  }
                "
              />
            </a-form-model-item>
            <a-form-model-item label="邮箱地址" ref="email" prop="email">
              <a-input
                v-model="form.email"
                @blur="
                  () => {
                    $refs.email.onFieldBlur();
                  }
                "
              />
            </a-form-model-item>
            <a-form-model-item label="手机号码">
              <a-input v-model="form.phoneNumber" />
            </a-form-model-item>
            <a-form-model-item label="登录失败,账户被锁定">
              <a-switch v-model="form.lockoutEnabled" />
            </a-form-model-item>
            <a-form-model-item label="二次认证">
              <a-switch v-model="form.twoFactorEnabled" />
            </a-form-model-item>
          </a-tab-pane>
          <a-tab-pane key="2" tab="角色">
            <a-form-model-item>
              <a-checkbox-group v-model="form.roleNames">
                <a-checkbox
                  v-for="role in assignableRoles"
                  :key="role.id"
                  :label="role.name"
                  :value="role.name"
                  name="roleName"
                >
                  {{ role.name }}
                </a-checkbox>
              </a-checkbox-group>
            </a-form-model-item>
          </a-tab-pane>
          <a-tab-pane key="3" tab="组织单元" :forceRender="true">
            <a-form-model-item>
              <org-tree ref="dialogOrgTree" v-model="form.orgIds" />
            </a-form-model-item>
          </a-tab-pane>
        </a-tabs>
      </a-form-model>
    </a-spin>
  </a-modal>
</template>

<script>
import {
  get,
  edit,
  getAssignableRoles,
  getRolesByUserId,
  getOrganizationsByUserId,
} from "@/services/identity/user";
import OrgTree from "@/components/module/organization/OrganizationTree";
export default {
  components: { OrgTree },
  name: "UserForm",
  data() {
    const passwordValidator = (rule, value, callback) => {
      if (this.form.id && !value) {
        callback();
        return;
      }

      if (!value) {
        callback(new Error("密码必须填写"));
        return;
      }
      if (value.length < 6) {
        callback(new Error("密码至少为6个字符."));
        return;
      }
      if (value.length > 128) {
        callback(new Error("密码必须是最大长度为128的字符串."));
        return;
      }
      let reg = /\d+/;
      if (!reg.test(value)) {
        callback(new Error("密码至少包含一位数字 ('0'-'9')."));
        return;
      }
      reg = /[a-z]+/;
      if (!reg.test(value)) {
        callback(new Error("密码至少包含一位小写字母 ('a'-'z')."));
        return;
      }
      reg = /[A-Z]+/;
      if (!reg.test(value)) {
        callback("密码至少包含一位大写字母 ('A'-'Z').");
        return;
      }
      reg = /\W+/;
      if (!reg.test(value)) {
        callback(new Error("密码至少包含一位非字母数字字符."));
        return;
      }

      callback();
    };
    return {
      labelCol: { span: 7 },
      wrapperCol: { span: 10 },
      visible: false,
      confirmLoading: false,
      form: {
        orgIds: [],
      },
      rules: {
        userName: [
          { required: true, message: "用户名必须填写", trigger: "blur" },
        ],
        password: [
          { validator: passwordValidator, trigger: ["blur", "change"] },
        ],
        // password: [
        //   { required: true, message: "密码必须填写", trigger: "blur" },
        // ],
        email: [
          {
            type: "email",
            required: true,
            message: "请填写正确的邮箱地址",
            trigger: "blur",
          },
        ],
      },
      assignableRoles: null,
    };
  },
  created() {},
  methods: {
    createOrEdit(model) {
      this.visible = true;
      // this.form = model;
      if (model && model.id) {
        this.getFormData(model.id);
      } else {
        this.form = {};
      }
      getAssignableRoles().then((response) => {
        this.assignableRoles = response.items;
      });
    },
    resetForm() {
      this.form = {};
    },
    getFormData(id) {
      this.confirmLoading = true;
      get(id)
        .then((res) => {
          this.form = Object.assign({ roleNames: [] }, res);
          getRolesByUserId(id).then((response) => {
            response.items.forEach((item) => {
              this.form.roleNames.push(item.name);
            });
          });
          getOrganizationsByUserId(id).then((response) => {
            this.form.orgIds = response.items.map((item) => item.id);
            // this.$refs.dialogOrgTree.checkedKeys=this.form.orgIds;
          });
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
          let values = this.form;
          edit(values)
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