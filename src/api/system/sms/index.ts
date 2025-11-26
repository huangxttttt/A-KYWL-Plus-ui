import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { SmsVO, SmsForm, SmsQuery } from '@/api/system/sms/types';

/**
 * 查询短信映射列表
 * @param query
 * @returns {*}
 */

export const listSms = (query?: SmsQuery): AxiosPromise<SmsVO[]> => {
  return request({
    url: '/system/sms/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询短信映射详细
 * @param id
 */
export const getSms = (id: string | number): AxiosPromise<SmsVO> => {
  return request({
    url: '/system/sms/' + id,
    method: 'get'
  });
};

/**
 * 新增短信映射
 * @param data
 */
export const addSms = (data: SmsForm) => {
  return request({
    url: '/system/sms',
    method: 'post',
    data: data
  });
};

/**
 * 修改短信映射
 * @param data
 */
export const updateSms = (data: SmsForm) => {
  return request({
    url: '/system/sms',
    method: 'put',
    data: data
  });
};

/**
 * 删除短信映射
 * @param id
 */
export const delSms = (id: string | number | Array<string | number>) => {
  return request({
    url: '/system/sms/' + id,
    method: 'delete'
  });
};


export const importSms = (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  return request({
    url: '/system/sms/import',
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data: formData
  });
};
