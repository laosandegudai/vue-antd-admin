<template>
  <!-- <a-modal
    title="资产标签"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
  > -->
    <div class="assets-tag" id="deviceTag">
      <table>
        <tr>
          <th colspan="3">XXXXX资产标签</th>
        </tr>
        <tr>
          <td>资产类别</td>
          <td>联想台式电脑</td>
          <th rowspan="6"><div ref="qrCodeDiv"></div>
          <!-- <p>监制单位 荆州市地方税务局</p> -->
          </th>
        </tr>
        <tr>
          <td class="lable">名称型号</td>
          <td class="text">SS11234324</td>
        </tr>
        <tr>
          <td class="lable">资产编号</td>
          <td class="text">535</td>
        </tr>
        <tr>
          <td class="lable">启用时间</td>
          <td class="text">2021-11-21</td>
        </tr>
        <tr>
          <td class="lable">资产原值</td>
          <td class="text">44545</td>
        </tr>
        <tr>
          <td class="lable">保管单位</td>
          <td class="text">办公处-张硕</td>
        </tr>
      </table>
    </div>
  <!-- </a-modal> -->
</template>
<script>
import QRCode from "qrcodejs2";
export default {
//   props: {
//     value: {
//       type: Object,
//       default() {
//         return () => {};
//       },
//     },
//   },
  data() {
    return {
      visible: false,
      confirmLoading: false,
    };
  },

  created() {
    setTimeout(()=>{
            this.drawQrCode();
        },100);
  },
  methods: {
    openModal(model){
        this.visible = true;
        setTimeout(()=>{
            this.drawQrCode();
        },100);
        
    },
    drawQrCode() {
      new QRCode(this.$refs.qrCodeDiv, {
        text: "https://www.baidu.com",
        width: 200,
        height: 200,
        colorDark: "#333333", //二维码颜色
        colorLight: "#ffffff", //二维码背景色
        correctLevel: QRCode.CorrectLevel.L, //容错率，L/M/H
      });
    },
    handleCancel() {
      this.visible = false;
    },
    handleOk() {
      this.confirmLoading = false;
    },
    
  },
};
</script>
<style lang="less">
    .assets-tag{
        display: none;
        text-align: center;
        table,tr,th,td{
            border:1px solid #000;
        }
        th{
            text-align: center;
            font-size: 24px;
        }
        .lable{
            width: 80px;
            
        }
        .text{
            width: 200px;
        }
    }
</style>