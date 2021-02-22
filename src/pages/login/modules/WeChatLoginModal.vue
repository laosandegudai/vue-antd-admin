<template>
  <a-modal
    title="微信扫码登录"
    :width="400"
    :visible="visible"
    :confirmLoading="confirmLoading"
    :footer="null"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <div class="weChat-miniProgram-pcLogin-area">
        <div class="weChat-miniProgram-pcLogin-aCode">
          <img :src="`data:image/png;base64,${form.aCode}`" alt="ACode" />
        </div>
      </div>
    </a-spin>
  </a-modal>
</template>

<script>
import { pcLoginAcode, pcLogin } from "@/services/user";
let that;
export default {
  data() {
    return {
      labelCol: { span: 7 },
      wrapperCol: { span: 10 },
      visible: false,
      confirmLoading: false,
      miniProgramName: "Default",
      form: {},
    };
  },
  created() {
    that = this;
  },
  methods: {
    createOrEdit(model) {
      this.visible = true;
      this.getPCLoginAcode();
    },
    getPCLoginAcode() {
      this.confirmLoading = true;
      pcLoginAcode({ miniProgramName: this.miniProgramName })
        .then((res) => {
          this.form = {
            ...res,
          };
          that.initPCLogin();
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
    },
    initPCLogin() {
      let intervalID = window.setInterval(function () {
        pcLogin({ token: that.form.token }).then((res) => {
          if (res.isSuccess) {
            clearInterval(intervalID);
            let obj = JSON.parse(res.rawData);
            that.$emit("ok", obj);
          }
        });
      }, 3000);
      this.$once("hook:beforeDestroy", () => {
        clearInterval(intervalID);
      });
    },
  },
};
</script>

<style scoped>
.weChat-miniProgram-pcLogin-aCode {
  /* margin-top: 30px; */
}

.weChat-miniProgram-pcLogin-aCode img {
  width: 100%;
}
</style>