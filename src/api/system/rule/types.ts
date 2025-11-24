export interface RuleVO {
  /**
   * 主键ID
   */
  id: string | number;

  /**
   * 规则类型：1=IP，2=IP段，3=国家，4=省份，5=城市
   */
  ruleType: number;

  /**
   * IP地址(IPv4/IPv6)
   */
  ipAddress: string;

  /**
   * CIDR IP段，例如 192.168.1.0/24
   */
  ipCidr: string | number;

  /**
   * 国家
   */
  country: string;

  /**
   * 省/州
   */
  province: string;

  /**
   * 城市
   */
  city: string;

  /**
   * 拦截原因
   */
  reason: string;

  /**
   * 规则到期时间，NULL=永久生效
   */
  expireTime: string;

  /**
   * 状态：1=启用，0=禁用
   */
  status: number;

}

export interface RuleForm extends BaseEntity {
  /**
   * 主键ID
   */
  id?: string | number;

  /**
   * 规则类型：1=IP，2=IP段，3=国家，4=省份，5=城市
   */
  ruleType?: number;

  /**
   * IP地址(IPv4/IPv6)
   */
  ipAddress?: string;

  /**
   * CIDR IP段，例如 192.168.1.0/24
   */
  ipCidr?: string | number;

  /**
   * 国家
   */
  country?: string;

  /**
   * 省/州
   */
  province?: string;

  /**
   * 城市
   */
  city?: string;

  /**
   * 拦截原因
   */
  reason?: string;

  /**
   * 规则到期时间，NULL=永久生效
   */
  expireTime?: string;

  /**
   * 状态：1=启用，0=禁用
   */
  status?: number;

}

export interface RuleQuery extends PageQuery {

  /**
   * 规则类型：1=IP，2=IP段，3=国家，4=省份，5=城市
   */
  ruleType?: number;

  /**
   * IP地址(IPv4/IPv6)
   */
  ipAddress?: string;

  /**
   * CIDR IP段，例如 192.168.1.0/24
   */
  ipCidr?: string | number;

  /**
   * 国家
   */
  country?: string;

  /**
   * 省/州
   */
  province?: string;

  /**
   * 城市
   */
  city?: string;

  /**
   * 拦截原因
   */
  reason?: string;

  /**
   * 规则到期时间，NULL=永久生效
   */
  expireTime?: string;

  /**
   * 状态：1=启用，0=禁用
   */
  status?: number;

  /**
   * 日期范围参数
   */
  params?: any;
}
