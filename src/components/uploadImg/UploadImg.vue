<template>
  <div class="clearfix">
    <a-upload
      :action="`${baseURL}/api/file-management/file/upload`"
      listType="picture-card"
      :fileList="fileList"
      :headers="headers"
      @preview="handlePreview"
      @change="handleChange"
      accept="image/*"
      :multiple="this.multiple()"
    >
      <div v-if="fileList.length < maxCount">
        <a-icon type="plus" />
        <div class="ant-upload-text">选择</div>
      </div>
    </a-upload>
    <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
      <img alt="example" style="width: 100%" :src="previewImage" />
    </a-modal>
  </div>
</template>
<script>
import TypeHelper from '@/utils/helper/TypeHelper'
const uuid = require('uuid')
import Cookie from 'js-cookie'
export default {
  props: {
    value: {
      type: String,
      value: ''
    },
    maxCount: {
      type: Number,
      default: 1
    }
  },
  mounted() {
    // if (this.maxCount == 1) {
    //   this.value = this.value || ''
    // } else {
    //   this.value = this.value || []
    // }
    this.checkType(this.value)

    this.refresh()
  },
  data() {
    return {
      previewVisible: false,
      previewImage: '',
      fileList: [],
      internelValue: {},
      baseURL: process.env.VUE_APP_API_BASE_URL,
      headers:{Authorization:Cookie.get('Authorization')}
    }
  },
  watch: {
    value(val) {
      //内部触发事件不处理,仅回传数据
      // if (val == this.internelValue) {
      //   return
      // }

      this.checkType(val)

      this.value = val
      this.refresh()
    }
  },
  methods: {
    multiple() {
      return this.maxCount > 1
    },
    checkType(val) {
      if (this.maxCount == 1 && TypeHelper.isArray(val)) {
        throw 'maxCount=1时model不能为Array'
      }
      if (this.maxCount > 1 && !TypeHelper.isArray(val)) {
        throw 'maxCount>1时model必须为Array<String>'
      }
    },
    refresh() {
      if (this.maxCount < 1) {
        throw 'maxCount必须>=1'
      }
      if (this.value) {
        let urls = []
        if (TypeHelper.isString(this.value)) {
          urls.push(this.value)
        } else if (TypeHelper.isArray(this.value)) {
          urls.push(...this.value)
        } else {
          throw 'value必须为字符串或数组'
        }
        this.fileList = urls.map(x => {
          return { name: x, uid: uuid.v4(), status: 'done', id:x,url: `${this.baseURL}/api/file-management/file/${x}/getFile` }
        })
      }
      else{
        this.fileList=[];
      }
    },
    handleCancel() {
      this.previewVisible = false
    },
    handlePreview(file) {
      this.previewImage = file.url || file.thumbUrl
      this.previewVisible = true
    },
    handleChange({ file, fileList }) {
      this.fileList = fileList
      if (file.status == 'done' || file.status == 'removed') {
        var values = this.fileList.filter(x => x.status == 'done').map(x => x.id || x.response.fileInfo.id)
        var newValue = this.maxCount == 1 ? values[0] : values
        this.internelValue = newValue
        //双向绑定
        this.$emit('input', newValue)
      }
    }
  }
}
</script>
<style>
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
</style>
