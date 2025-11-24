export interface SmsVO {
  /**
   * 主键
   */
  id: string | number;

  /**
   * 用户账号
   */
  userName: string;

  /**
   * 电话号码（E.164格式）
   */
  phoneNumber: string;

  /**
   * 目标URL
   */
  targetUrl: string;

  /**
   * 短码
   */
  shortcode: string;

  /**
   * 发送状态（0未发送 1已发送 2发送失败）
   */
  sendStatus: string;

}

export interface SmsForm extends BaseEntity {
  /**
   * 主键
   */
  id?: string | number;

  /**
   * 用户账号
   */
  userName?: string;

  /**
   * 电话号码（E.164格式）
   */
  phoneNumber?: string;

  /**
   * 目标URL
   */
  targetUrl?: string;

  /**
   * 短码
   */
  shortcode?: string;

  /**
   * 发送状态（0未发送 1已发送 2发送失败）
   */
  sendStatus?: string;

}

export interface SmsQuery extends PageQuery {

  /**
   * 用户账号
   */
  userName?: string;

  /**
   * 电话号码（E.164格式）
   */
  phoneNumber?: string;

  /**
   * 目标URL
   */
  targetUrl?: string;

  /**
   * 短码
   */
  shortcode?: string;

  /**
   * 发送状态（0未发送 1已发送 2发送失败）
   */
  sendStatus?: string;

  /**
   * 日期范围参数
   */
  params?: any;
}
