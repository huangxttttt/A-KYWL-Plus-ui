<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="电话号码" prop="phoneNumber">
              <el-input v-model="queryParams.phoneNumber" placeholder="请输入电话号码" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="目标URL" prop="targetUrl">
              <el-input v-model="queryParams.targetUrl" placeholder="请输入目标URL" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="发送状态" prop="sendStatus">
              <el-select v-model="queryParams.sendStatus" placeholder="请选择发送状态" clearable >
                <el-option v-for="dict in sys_sms_send" :key="dict.value" :label="dict.label" :value="dict.value"/>
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
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['system:sms:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()" v-hasPermi="['system:sms:edit']">修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()" v-hasPermi="['system:sms:remove']">删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['system:sms:export']">导出</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-upload
              :show-file-list="false"
              accept=".xlsx,.xls"
              :before-upload="beforeImport"
              :http-request="handleImport"
            >
              <el-button
                type="info"
                plain
                icon="Upload"
                :loading="importLoading"
                v-hasPermi="['system:sms:import']"
              >
                导入
              </el-button>
            </el-upload>
          </el-col>
          <!-- ⭐ 新增：模板下载按钮 -->
          <el-col :span="1.5">
            <el-button
              type="success"
              plain
              icon="Document"
              @click="handleImportTemplate"
              v-hasPermi="['system:sms:import']"
            >
              模板下载
            </el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" border :data="smsList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
<!--        <el-table-column label="主键" align="center" prop="id" v-if="true" />-->
        <el-table-column label="用户账号" align="center" prop="userName" />
        <el-table-column label="电话号码" align="center" prop="phoneNumber" />
        <el-table-column label="目标URL" align="center" prop="targetUrl" />
        <el-table-column label="短码" align="center" prop="shortcode" />
        <el-table-column label="创建时间" align="center" prop="createTime" />
        <el-table-column label="发送状态" align="center" prop="sendStatus">
          <template #default="scope">
            <dict-tag :options="sys_sms_send" :value="scope.row.sendStatus"/>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" fixed="right"  class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['system:sms:edit']"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['system:sms:remove']"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
    <!-- 添加或修改短信映射对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="smsFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="电话号码" prop="phoneNumber">
          <el-input v-model="form.phoneNumber" placeholder="请输入电话号码" />
        </el-form-item>
        <el-form-item label="目标URL" prop="targetUrl">
          <el-input v-model="form.targetUrl" placeholder="请输入目标URL" />
        </el-form-item>
        <el-form-item label="发送状态" prop="sendStatus">
          <el-radio-group v-model="form.sendStatus">
            <el-radio
              v-for="dict in sys_sms_send"
              :key="dict.value"
              :value="dict.value"
            >{{dict.label}}</el-radio>
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

<script setup name="Sms" lang="ts">
import { listSms, getSms, delSms, addSms, updateSms, importSms } from '@/api/system/sms';
import { SmsVO, SmsQuery, SmsForm } from '@/api/system/sms/types';
import type { UploadRequestOptions } from 'element-plus';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const { sys_sms_send, sys_normal_disable } = toRefs<any>(proxy?.useDict('sys_sms_send', 'sys_normal_disable'));

const smsList = ref<SmsVO[]>([]);
const importLoading = ref(false);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const smsFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: SmsForm = {
  id: undefined,
  userName: undefined,
  phoneNumber: undefined,
  targetUrl: undefined,
  shortcode: undefined,
  sendStatus: undefined,
  createTime: undefined
}
const data = reactive<PageData<SmsForm, SmsQuery>>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    userName: undefined,
    phoneNumber: undefined,
    targetUrl: undefined,
    shortcode: undefined,
    sendStatus: undefined,
    params: {
    }
  },
  rules: {
    phoneNumber: [
      { required: true, message: "电话号码不能为空", trigger: "blur" }
    ],
    targetUrl: [
      { required: true, message: "目标URL不能为空", trigger: "blur" }
    ]
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询短信映射列表 */
const getList = async () => {
  loading.value = true;
  const res = await listSms(queryParams.value);
  smsList.value = res.rows;
  total.value = res.total;
  loading.value = false;
}

/** 取消按钮 */
const cancel = () => {
  reset();
  dialog.visible = false;
}

/** 表单重置 */
const reset = () => {
  form.value = {...initFormData};
  smsFormRef.value?.resetFields();
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value?.resetFields();
  handleQuery();
}

/** 多选框选中数据 */
const handleSelectionChange = (selection: SmsVO[]) => {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加短信映射";
}

/** 修改按钮操作 */
const handleUpdate = async (row?: SmsVO) => {
  reset();
  const _id = row?.id || ids.value[0]
  const res = await getSms(_id);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改短信映射";
}

/** 提交按钮 */
const submitForm = () => {
  smsFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updateSms(form.value).finally(() =>  buttonLoading.value = false);
      } else {
        await addSms(form.value).finally(() =>  buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("操作成功");
      dialog.visible = false;
      await getList();
    }
  });
}

/** 删除按钮操作 */
const handleDelete = async (row?: SmsVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除短信映射编号的数据项？').finally(() => loading.value = false);
  await delSms(_ids);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('system/sms/export', {
    ...queryParams.value
  }, `sms_${new Date().getTime()}.xlsx`)
}
/** 导入前校验文件 */
const beforeImport = (file: File) => {
  const isExcel =
    file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
    file.type === 'application/vnd.ms-excel';
  if (!isExcel) {
    proxy?.$modal.msgError('只能上传 Excel 文件（.xlsx 或 .xls）');
    return false;
  }
  // 这里限制 100MB，可按需调整
  const isLt100M = file.size / 1024 / 1024 < 100;
  if (!isLt100M) {
    proxy?.$modal.msgError('上传文件大小不能超过 100MB');
    return false;
  }
  return true;
};

/** 自定义上传逻辑：调用后台导入接口 */
const handleImport = async (options: UploadRequestOptions) => {
  const { file } = options;

  try {
    importLoading.value = true;

    const res = await importSms(file as File);
    proxy?.$modal.msgSuccess(res.msg || '导入成功');

    // ⭐⭐ 导入成功之后自动刷新列表
    await getList();

    // 告诉 el-upload 成功了（可选）
    options?.onSuccess?.(res as any, file as any);
  } catch (e: any) {
    proxy?.$modal.msgError(e?.msg || '导入失败');
    options?.onError?.(e as any);
  } finally {
    importLoading.value = false;
  }
};

/** 导入模板下载 */
const handleImportTemplate = () => {
  // 这里的 URL 需要你后端提供一个接口，比如 /system/sms/importTemplate
  proxy?.download(
    'system/sms/importTemplate',
    {},
    `sms_import_template_${new Date().getTime()}.xlsx`
  );
}

onMounted(() => {
  getList();
});
</script>
