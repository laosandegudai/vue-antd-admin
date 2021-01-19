<template>
  <a-tree
    v-model="checkedKeys"
    checkable
    :auto-expand-parent="autoExpandParent"
    :tree-data="treeData"
    :replaceFields="replaceFields"
  />
</template>
<script>
import { getOrganizationsAllWithDetails } from "@/services/identity/organization";
export default {
  props: {
    value: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data() {
    return {
      autoExpandParent: true,
      checkedKeys: [],
      treeData:null,
      replaceFields:{children:'children', title:'displayName', key:'id',value:'id' },
      treeQuery: {
        sort: 'code',
        filter: undefined
      },
      isFirstMount: true, // 控制防止重复回显
    };
  },
  watch: {
    value: {
      handler (val) {
        this.checkedKeys=val;
      },
      deep: true
    },
    checkedKeys(val) {
      this.$emit('input', val)
    },
  },
  created() {
    this.getOrgs()
  },
  methods: {
    getOrgs() {
      getOrganizationsAllWithDetails(this.treeQuery).then(response => {
        this.treeData = response.items
      })
    },
    onCheck(checkedKeys) {
      console.log('onCheck', checkedKeys);
      this.checkedKeys = checkedKeys;
    },
  },
};
</script>
