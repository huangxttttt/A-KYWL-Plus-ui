import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { RuleVO, RuleForm, RuleQuery } from '@/api/system/rule/types';

/**
 * 查询访问拦截规则（支持IP/地区）列表
 * @param query
 * @returns {*}
 */

export const listRule = (query?: RuleQuery): AxiosPromise<RuleVO[]> => {
  return request({
    url: '/system/rule/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询访问拦截规则（支持IP/地区）详细
 * @param id
 */
export const getRule = (id: string | number): AxiosPromise<RuleVO> => {
  return request({
    url: '/system/rule/' + id,
    method: 'get'
  });
};

/**
 * 新增访问拦截规则（支持IP/地区）
 * @param data
 */
export const addRule = (data: RuleForm) => {
  return request({
    url: '/system/rule',
    method: 'post',
    data: data
  });
};

/**
 * 修改访问拦截规则（支持IP/地区）
 * @param data
 */
export const updateRule = (data: RuleForm) => {
  return request({
    url: '/system/rule',
    method: 'put',
    data: data
  });
};

/**
 * 删除访问拦截规则（支持IP/地区）
 * @param id
 */
export const delRule = (id: string | number | Array<string | number>) => {
  return request({
    url: '/system/rule/' + id,
    method: 'delete'
  });
};
