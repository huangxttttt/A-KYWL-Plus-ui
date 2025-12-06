<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="规则类型" prop="ipAddress">
              <el-select v-model="queryParams.sendStatus" placeholder="请选择规则类型" clearable >
                <el-option v-for="dict in sys_rule" :key="dict.value" :label="dict.label" :value="dict.value"/>
              </el-select>
            </el-form-item>
            <el-form-item label="IP地址" prop="ipAddress">
              <el-input v-model="queryParams.ipAddress" placeholder="请输入IP地址(IPv4/IPv6)" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="IP段" prop="ipCidr">
              <el-input v-model="queryParams.ipCidr" placeholder="192.168.1.0/24" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="国家" prop="country">
              <el-input v-model="queryParams.country" placeholder="请输入国家" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="省/州" prop="province">
              <el-input v-model="queryParams.province" placeholder="请输入省/州" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="城市" prop="city">
              <el-input v-model="queryParams.city" placeholder="请输入城市" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="状态" prop="status">
              <el-select v-model="queryParams.status" placeholder="请选择状态" clearable>
                <el-option v-for="dict in sys_normal_disable" :key="dict.value" :label="dict.label" :value="dict.value" />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
              <el-button icon="Refresh" @click="resetQuery">重置</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </div>
    </transition>

    <el-card shadow="never">
      <template #header>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['system:rule:add']">新增 </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()" v-hasPermi="['system:rule:edit']">修改 </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()" v-hasPermi="['system:rule:remove']"
              >删除
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['system:rule:export']"> 导出 </el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" border :data="ruleList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <!--        <el-table-column label="主键ID" align="center" prop="id" v-if="true" />-->
        <el-table-column label="规则类型" align="center" prop="ruleType" >
          <template #default="scope">
            <dict-tag :options="sys_rule" :value="scope.row.ruleType" />
          </template>
        </el-table-column>
        <el-table-column label="IP地址" align="center" prop="ipAddress" />
        <el-table-column label="IP段" align="center" prop="ipCidr" />
        <el-table-column label="国家" align="center" prop="country" />
        <el-table-column label="省/州" align="center" prop="province" />
        <el-table-column label="城市" align="center" prop="city" />
        <el-table-column label="拦截原因" align="center" prop="reason" />
        <el-table-column label="状态" align="center" prop="status">
          <template #default="scope">
            <dict-tag :options="sys_normal_disable" :value="scope.row.status" />
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" fixed="right" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['system:rule:edit']"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['system:rule:remove']"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>

    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="ruleFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="规则类型" prop="ruleType">
          <el-radio-group v-model="form.ruleType" @change="handleRuleTypeChange">
            <el-radio v-for="dict in sys_rule" :key="dict.value" :value="parseInt(dict.value)">{{ dict.label }} </el-radio>
          </el-radio-group>
        </el-form-item>

        <!-- 根据 ruleType 条件渲染输入框 -->

        <!-- IP 地址 -->
        <el-form-item label="IP地址" prop="ipAddress" v-if="form.ruleType === 1">
          <el-input v-model="form.ipAddress" placeholder="请输入IP地址(IPv4/IPv6)" />
        </el-form-item>

        <!-- IP 段 -->
        <el-form-item label="IP段" prop="ipCidr" v-if="form.ruleType === 2">
          <el-input v-model="form.ipCidr" placeholder="请输入IP段，例如 192.168.1.0/24" />
        </el-form-item>

        <!-- 国家 -->
        <el-form-item label="国家" prop="country" v-if="form.ruleType === 3">
          <el-input v-model="form.country" placeholder="请输入国家" />
        </el-form-item>

        <!-- 省/州 -->
        <el-form-item label="省/州" prop="province" v-if="form.ruleType === 4">
          <el-input v-model="form.province" placeholder="请输入省/州" />
        </el-form-item>

        <!-- 城市 -->
        <el-form-item label="城市" prop="city" v-if="form.ruleType === 5">
          <el-input v-model="form.city" placeholder="请输入城市" />
        </el-form-item>

        <el-form-item label="拦截原因" prop="reason">
          <el-input v-model="form.reason" placeholder="请输入拦截原因" />
        </el-form-item>

        <!-- 状态 -->
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio v-for="dict in sys_normal_disable" :key="dict.value" :value="parseInt(dict.value)">{{ dict.label }} </el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button :loading="buttonLoading" type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>


  </div>
</template>

<script setup name="Rule" lang="ts">
import { listRule, getRule, delRule, addRule, updateRule } from '@/api/system/rule';
import { RuleVO, RuleQuery, RuleForm } from '@/api/system/rule/types';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const { sys_normal_disable, sys_rule } = toRefs<any>(proxy?.useDict('sys_normal_disable', 'sys_rule'));

const ruleList = ref<RuleVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const ruleFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: RuleForm = {
  id: undefined,
  ruleType: undefined,
  ipAddress: undefined,
  ipCidr: undefined,
  country: undefined,
  province: undefined,
  city: undefined,
  reason: undefined,
  status: undefined
};
const data = reactive<PageData<RuleForm, RuleQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    ruleType: undefined,
    ipAddress: undefined,
    ipCidr: undefined,
    country: undefined,
    province: undefined,
    city: undefined,
    reason: undefined,
    status: undefined,
    params: {}
  },
  rules: {
    id: [{ required: true, message: '主键ID不能为空', trigger: 'blur' }],
    ruleType: [{ required: true, message: '规则类型：1=IP，2=IP段，3=国家，4=省份，5=城市不能为空', trigger: 'change' }],
    status: [{ required: true, message: '状态不能为空', trigger: 'change' }]
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询访问拦截规则（支持IP/地区）列表 */
const getList = async () => {
  loading.value = true;
  const res = await listRule(queryParams.value);
  ruleList.value = res.rows;
  total.value = res.total;
  loading.value = false;
};

/** 取消按钮 */
const cancel = () => {
  reset();
  dialog.visible = false;
};

/** 表单重置 */
const reset = () => {
  form.value = { ...initFormData };
  ruleFormRef.value?.resetFields();
};

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.value.pageNum = 1;
  getList();
};

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value?.resetFields();
  handleQuery();
};

/** 多选框选中数据 */
const handleSelectionChange = (selection: RuleVO[]) => {
  ids.value = selection.map((item) => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
};

const handleRuleTypeChange = () => {

  // 根据选择的 ruleType 清空不相关的字段
  if (data.form.ruleType === 1) {
    // 清空与 IP 地址相关的字段
    data.form.ipCidr = '';
    data.form.country = '';
    data.form.province = '';
    data.form.city = '';
  } else if (data.form.ruleType === 2) {
    // 清空与 IP 段相关的字段
    data.form.ipAddress = '';
    data.form.country = '';
    data.form.province = '';
    data.form.city = '';
  } else if (data.form.ruleType === 3) {
    // 清空与国家相关的字段
    data.form.ipAddress = '';
    data.form.ipCidr = '';
    data.form.province = '';
    data.form.city = '';
  } else if (data.form.ruleType === 4) {
    // 清空与省/州相关的字段
    data.form.ipAddress = '';
    data.form.ipCidr = '';
    data.form.country = '';
    data.form.city = '';
  } else if (data.form.ruleType === 5) {
    // 清空与城市相关的字段
    data.form.ipAddress = '';
    data.form.ipCidr = '';
    data.form.country = '';
    data.form.province = '';
  }
};



/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = '添加访问拦截规则';
};

/** 修改按钮操作 */
const handleUpdate = async (row?: RuleVO) => {
  reset();
  const _id = row?.id || ids.value[0];
  const res = await getRule(_id);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = '修改访问拦截规则';
};

/** 提交按钮 */
const submitForm = () => {
  ruleFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updateRule(form.value).finally(() => (buttonLoading.value = false));
      } else {
        await addRule(form.value).finally(() => (buttonLoading.value = false));
      }
      proxy?.$modal.msgSuccess('操作成功');
      dialog.visible = false;
      await getList();
    }
  });
};

/** 删除按钮操作 */
const handleDelete = async (row?: RuleVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除访问拦截规则（支持IP/地区）编号为"' + _ids + '"的数据项？').finally(() => (loading.value = false));
  await delRule(_ids);
  proxy?.$modal.msgSuccess('删除成功');
  await getList();
};

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download(
    'system/rule/export',
    {
      ...queryParams.value
    },
    `rule_${new Date().getTime()}.xlsx`
  );
};

onMounted(() => {
  getList();
});
</script>
