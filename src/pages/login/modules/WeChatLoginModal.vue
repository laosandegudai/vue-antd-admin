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
        <div class="weChat-miniProgram-pcLogin-aCode"><img :src="`data:image/png;base64,${form.aCode}`" alt="ACode"/></div>
      </div>
      
    </a-spin>
  </a-modal>
</template>

<script>
import { pcLoginAcode } from "@/services/user";
export default {
  data() {
    return {
      labelCol: { span: 7 },
      wrapperCol: { span: 10 },
      visible: false,
      confirmLoading: false,
      miniProgramName:"Default",
      form: {
      },
    };
  },
  created() {
  },
  methods: {
    createOrEdit(model){
      this.visible = true;
      this.getPCLoginAcode();
    },
    getPCLoginAcode() {
      this.confirmLoading = true;
      pcLoginAcode({miniProgramName:this.miniProgramName}).then((res) => {
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
      
    }
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