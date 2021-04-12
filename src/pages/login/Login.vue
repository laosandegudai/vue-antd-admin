<template>
  <common-layout>
    <div class="top">
      <div class="header">
        <img alt="logo" class="logo" src="@/assets/img/logo.png" />
        <span class="title">{{ systemName }}</span>
      </div>
      <div class="desc">abp vNext(net5) + ant vue admin</div>
    </div>
    <div class="login">
      <a-form @submit="onSubmit" :form="form">
        <a-alert
          type="error"
          :closable="true"
          v-show="error"
          :message="error"
          showIcon
          style="margin-bottom: 24px"
        />
        <a-form-item>
          <a-input
            size="large"
            addon-before="租户"
            disabled
            placeholder="未选择"
            v-model="tenant"
          >
            <a-button slot="suffix" type="primary" @click="visible = true">
              切换
            </a-button>
          </a-input>
        </a-form-item>
        <a-form-item>
          <a-input
            autocomplete="autocomplete"
            size="large"
            placeholder="admin"
            v-decorator="[
              'name',
              {
                rules: [
                  { required: true, message: '请输入账户名', whitespace: true },
                ],
              },
            ]"
          >
            <a-icon slot="prefix" type="user" />
          </a-input>
        </a-form-item>
        <a-form-item>
          <a-input
            size="large"
            placeholder="1q2w3E*"
            autocomplete="autocomplete"
            type="password"
            v-decorator="[
              'password',
              {
                rules: [
                  { required: true, message: '请输入密码', whitespace: true },
                ],
              },
            ]"
          >
            <a-icon slot="prefix" type="lock" />
          </a-input>
        </a-form-item>
        <div>
          <a-checkbox :checked="true">自动登录</a-checkbox>
        </div>
        <a-form-item>
          <a-button
            :loading="logging"
            style="width: 100%; margin-top: 24px"
            size="large"
            htmlType="submit"
            type="primary"
            >登录</a-button
          >
        </a-form-item>
        <div>
          其他登录方式
          <a-icon class="icon" type="wechat"  @click="$refs.weChatLoginModal.createOrEdit()" />
        </div>
      </a-form>
      <a-modal
        title="切换租户"
        :visible="visible"
        :confirm-loading="confirmLoading"
        @ok="tenantSwitchModal"
        @cancel="visible = false"
      >
        <a-input v-model="tenantName" size="large" placeholder="租户名称" />
      </a-modal>
    </div>
    <we-chat-login-modal ref="weChatLoginModal" @ok="handleOk($event)"  />
  </common-layout>
</template>

<script>
import CommonLayout from "@/layouts/CommonLayout";
import {
  login,
  applicationConfiguration,
} from "@/services/user";
import { setAuthorization } from "@/utils/request";
import { loadRoutes } from "@/utils/routerUtil";
import { mapMutations } from "vuex";
import { tenantSwitch } from "@/services/multi-tenancy/tenant";
import WeChatLoginModal from "./modules/WeChatLoginModal";
export default {
  name: "Login",
  components: { CommonLayout,WeChatLoginModal },
  data() {
    return {
      logging: false,
      error: "",
      form: this.$form.createForm(this),
      visible: false,
      confirmLoading: false,
      tenant: "",
      tenantName: "",
    };
  },
  computed: {
    systemName() {
      return this.$store.state.setting.systemName;
    },
  },
  methods: {
    ...mapMutations("account", ["setUser", "setPermissions", "setRoles"]),
    onSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err) => {
        if (!err) {
          this.logging = true;
          const name = this.form.getFieldValue("name");
          const password = this.form.getFieldValue("password");
          const tenant = this.tenant;
          login(name, password, tenant)
            .then(this.afterLogin)
            .finally(() => {
              this.logging = false;
            });
        }
      });
    },
    afterLogin(res) {
      this.logging = false;
      const loginRes = res;
      if (loginRes) {
        setAuthorization({
          token: loginRes.access_token,
          expireAt: new Date(new Date().getTime() + loginRes.expires_in),
        });
        // 获取路由配置
        // getRoutesConfig().then((result) => {
        //   const routesConfig = result.data.data;
        //   loadRoutes(
        //     { router: this.$router, store: this.$store, i18n: this.$i18n },
        //     routesConfig
        //   );
        //   this.$router.push("/demo");
        //   this.$message.success(loginRes.message, 3);
        // });
        applicationConfiguration().then((res) => {
          res.currentUser.tenantName=res.currentTenant.name;
          this.setUser(res.currentUser);
          let permissions = this.handlePermissions(res.auth.grantedPolicies);
          this.setPermissions(permissions);
          this.setRoles(res.currentUser.roles);
          loadRoutes();
          this.$message.success("登录成功", 3);
          this.$router.push('/dashboard/analysis')
        });
      } else {
        this.error = loginRes.message;
      }
    },
    handlePermissions(obj) {
      let permissions = [];
      if (!obj) {
        return permissions;
      }
      permissions = Object.keys(obj).map((x) => {
        return {
          id: x,
          operation: [],
        };
      });
      return permissions;
    },
    tenantSwitchModal() {
      this.confirmLoading = true;
      let params = {
        name: this.tenantName,
      };
      tenantSwitch(params)
        .then((res) => {
          this.visible = false;
          this.tenant = this.tenantName;
        })
        .finally(() => {
          this.confirmLoading = false;
        });
    },
    handleOk(res){
      this.afterLogin(res);
    }
  },
};
</script>

<style lang="less" scoped>
.common-layout {
  .top {
    text-align: center;
    .header {
      height: 44px;
      line-height: 44px;
      a {
        text-decoration: none;
      }
      .logo {
        height: 44px;
        vertical-align: top;
        margin-right: 16px;
      }
      .title {
        font-size: 33px;
        color: @title-color;
        font-family: "Myriad Pro", "Helvetica Neue", Arial, Helvetica,
          sans-serif;
        font-weight: 600;
        position: relative;
        top: 2px;
      }
    }
    .desc {
      font-size: 14px;
      color: @text-color-second;
      margin-top: 12px;
      margin-bottom: 40px;
    }
  }
  .login {
    width: 368px;
    margin: 0 auto;
    @media screen and (max-width: 576px) {
      width: 95%;
    }
    @media screen and (max-width: 320px) {
      .captcha-button {
        font-size: 14px;
      }
    }
    .icon {
      font-size: 24px;
      color: @text-color-second;
      margin-left: 16px;
      vertical-align: middle;
      cursor: pointer;
      transition: color 0.3s;

      &:hover {
        color: @primary-color;
      }
    }
  }
}
</style>
