import Vue from 'vue';
/*富文本编辑图片上传配置*/
const uploadConfig = {
  // action:  'https://www.lumingtec.cn/Business/serviceInterface/fileUpload.json',  // 必填参数 图片上传地址
  methods: 'POST', // 必填参数 图片上传方式
  token: '', // 可选参数 如果需要token验证，假设你的token有存放在sessionStorage
  name: 'file', // 必填参数 文件的参数名
  size: 700, // 可选参数   图片大小，单位为Kb, 1M = 1024Kb
  accept: 'image/png, image/gif, image/jpeg, image/bmp, image/x-icon', // 可选 可上传的图片格式
  type:'audio/mp4,video/mp4'
}

// toolbar工具栏的工具选项（默认展示全部）
const toolOptions = [
  ['bold', 'italic', 'underline', 'strike'],
  ['blockquote', 'code-block'],
  [{ header: 1 }, { header: 2 }],
  [{ list: 'ordered' }, { list: 'bullet' }],
  [{ script: 'sub' }, { script: 'super' }],
  [{ indent: '-1' }, { indent: '+1' }],
  [{ direction: 'rtl' }],
  [{ size: ['small', false, 'large', 'huge'] }],
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ color: [] }, { background: [] }],
  [{ font: [] }],
  [{ align: [] }],
  ['clean'],
  ['link', 'image', 'video']
]
function uploadFilePic(quill,files,index){
  // 创建formData
  var formData = new FormData()

  formData.append(uploadConfig.name, files[index])
  // 如果需要token且存在token
  if (uploadConfig.token) {
    formData.append('token', uploadConfig.token)
  }
  Vue.axios.post("/api/File/Upload",formData).then(response => {
    console.log('upload response:', response)
    let url =response.Path
    let length = quill.getSelection().index　//获取当前鼠标焦点位置
    quill.insertEmbed(length, 'image',url)
    quill.setSelection(length + 1)
    index+=1;
    if(index<files.length){
      uploadFilePic(quill,files,index);
    }
  })
}
const handlers = {
//配置上传图片
  image: function image() {
    var self = this
    var fileInput = this.container.querySelector('input.ql-image[type=file]')
    if (fileInput === null) {
      fileInput = document.createElement('input')
      fileInput.setAttribute('type', 'file')
      // 设置图片参数名
      if (uploadConfig.name) {
        fileInput.setAttribute('name', uploadConfig.name)
      }
      // 可设置上传图片的格式
      fileInput.setAttribute('accept', uploadConfig.accept)
      fileInput.setAttribute('multiple', 'multiple')
      fileInput.classList.add('ql-image')
      // 监听选择文件
      fileInput.addEventListener('change', function() {
        if (fileInput.files.length === 0) {
          return;
        }
        uploadFilePic(self.quill,fileInput.files,0);
        
      })

      this.container.appendChild(fileInput)
    }
    fileInput.click()
  },
  //配置上传视频
  video: function(value) {
    var self = this
      var fileInput = this.container.querySelector('input.ql-video[type=file]')
      if (fileInput === null) {
        fileInput = document.createElement('input')
        fileInput.setAttribute('type', 'file')
        if (uploadConfig.name) {
          fileInput.setAttribute('name', uploadConfig.name)
        }
        fileInput.setAttribute('accept', uploadConfig.type)
        fileInput.classList.add('ql-video')
        fileInput.addEventListener('change', function() {
          if (fileInput.files.length === 0) {
            return;
          }
          var formData = new FormData()
          formData.append(uploadConfig.name, fileInput.files[0])
          if (uploadConfig.token) {
            formData.append('token', uploadConfig.token)
          }
          Vue.axios.post("/api/File/Upload",formData).then(response => {
            console.log('upload response:', response)    
            // let url = 'https://www.lumingtec.cn/Business/file/' + response.fileName
            let url =response.Path
            let length = self.quill.getSelection().index　//获取当前鼠标焦点位置
            self.quill.insertEmbed(length, 'video',url)
          })
        })

        this.container.appendChild(fileInput)
      }
      fileInput.click()
  }
}



export default  {
    placeholder: '',
    theme: 'snow', // 主题
    modules: {
      toolbar: {
        container: toolOptions, // 工具栏选项
        handlers: handlers // 事件重写
      }
    }
  }

