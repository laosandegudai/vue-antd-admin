<template>
  <a-spin :spinning="loading">
    <div class="table-operator">
      <a-button class="editable-add-btn" icon="plus" type="default" @click="handleAdd">添加</a-button>
      <!-- <a-button class="editable-add-btn" icon="check" type="primary" @click="handleSave">保存</a-button> -->
    </div>
    <a-table :columns="columns" :dataSource="data" bordered size="small" :pagination="false">
      <template v-for="col in ['code', 'displayText','description']" :slot="col" slot-scope="text, record">
        <div :key="col">
          <a-input
            v-if="record.editable"
            style="margin: -5px 0"
            :value="text"
            @change="e => handleChange(e.target.value, record.key, col)"
          />
          <template v-else>{{ text }}</template>
        </div>
      </template>
      <template slot="operation" slot-scope="text, record">
        <div class="editable-row-operations">
          <span v-if="record.editable">
            <a @click="() => save(record.key)">保存</a>
            <a-popconfirm title="确认取消吗?" @confirm="() => onDelete(record.key)">
              <a>取消</a>
            </a-popconfirm>
          </span>
          <span v-else>
            <a @click="() => edit(record.key)">编辑</a>
            <a-popconfirm v-if="data.length" title="确认删除吗?" @confirm="() => onDelete(record.key)">
              <a href="javascript:;">删除</a>
            </a-popconfirm>
          </span>
        </div>
      </template>
    </a-table>
  </a-spin>
</template>
<script>
const columns = [
  { title: '编码', dataIndex: 'code', width: '15%', scopedSlots: { customRender: 'code' } },
  { title: '显示文本', dataIndex: 'displayText', width: '20%', scopedSlots: { customRender: 'displayText' } },
  { title: '描述', dataIndex: 'description', width: '30%', scopedSlots: { customRender: 'description' } },
  { title: '操作', dataIndex: 'operation', scopedSlots: { customRender: 'operation' } }
]
export default {
  props:{
    value: {
      type: Array,
      default () {
        return []
      }
    },
  },
  data() {
    return {
      data: [],
      columns,
      loading: false,
      parentId: null
    }
  },
  watch: {
    value: {
      handler (val) {
        this.setDataList(val)
      },
      deep: true
    }
  },
  created(){

  },
  methods: {
    handleChange(value, key, column) {
      const newData = [...this.data]
      const target = newData.filter(item => key === item.key)[0]
      if (target) {
        target[column] = value
        this.data = newData
      }
    },
    edit(key) {
      const newData = [...this.data]
      const target = newData.filter(item => key === item.key)[0]
      if (target) {
        target.editable = true
        this.data = newData
      }
    },
    save(key) {
      const newData = [...this.data]
      const target = newData.filter(item => key === item.key)[0]
      if (target) {
        delete target.editable
        this.data = newData
        this.resetCache(newData)
      }
    },
    cancel(key) {
      const newData = [...this.data]
      const target = newData.filter(item => key === item.key)[0]
      if (target) {
        Object.assign(target, this.cacheData.filter(item => key === item.key)[0])
        delete target.editable
        this.data = newData
      }
    },
    onDelete(key) {
      const data = [...this.data]
      // this.data.splice(key, 1);
      this.data = data.filter(item => item.key !== key)
    },
    handleAdd() {
      const length = this.data.length
      const newData = {
        key: length+1,
        id:null,
        code: '',
        displayText: '',
        description:'',
        editable: true,
      }
      this.data = [...this.data, newData]
    },
    getDataList() {
      return this.data
    },
    resetCache(dataSource) {
        this.cacheData = dataSource.map(item => ({ ...item }))
    },
    setDataList(data) {
      data=data.map((item,index)=>{
        item.key=index;
        return item;
      });
      this.data = data
      this.resetCache(this.data)
    },
  }
}
</script>
<style scoped>
.editable-row-operations a {
  margin-right: 8px;
}
.editable-add-btn {
  margin-bottom: 8px;
}
</style>
