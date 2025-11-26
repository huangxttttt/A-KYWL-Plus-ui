<template>
  <div class="app-container home">
    <el-row :gutter="20">
      <!-- 左侧：公司介绍 -->
      <el-col :sm="24" :lg="12" style="padding-left: 20px">
        <h2>跨越未来科技有限公司</h2>
        <p>
          跨越未来科技有限公司专注于企业数字化与智能化转型，致力于为中小企业提供<br />
          安全稳定、可持续演进的技术解决方案与产品服务。
          <br /><br />
          我们聚焦以下方向：
          <br />
          * 企业数字化平台建设（门户、后台管理、业务中台）<br />
          * SaaS 产品定制与集成<br />
          * 短链与营销活动平台（短信、短链接跳转、数据统计）<br />
          * 高并发高可用系统设计与落地<br />
          * 云原生架构改造与微服务治理<br />
          * DevOps 持续集成与自动化部署<br />
        </p>
        <p><b>公司使命:</b> <span>用技术跨越边界，让业务持续增长</span></p>
        <p>
          <el-tag type="success">专注 · 专业 · 可落地</el-tag>
        </p>
        <p>
          <!-- 这些链接你替换成自己真实地址即可 -->
          <el-button
            type="primary"
            icon="Cloudy"
            plain
            @click="goTarget('https://www.example.com')"
          >
            公司官网
          </el-button>
          <el-button
            type="primary"
            icon="Document"
            plain
            @click="goTarget('https://www.example.com/products')"
          >
            产品介绍
          </el-button>
          <el-button
            type="primary"
            icon="Phone"
            plain
            @click="goTarget('https://www.example.com/contact')"
          >
            联系我们
          </el-button>
        </p>
      </el-col>

      <!-- 右侧：技术栈与核心能力 -->
      <el-col :sm="24" :lg="12" style="padding-left: 20px">
        <h2>技术栈与核心能力</h2>
        <p>
          为保障系统的高可用与可扩展性，跨越未来科技在实际项目中采用业界主流且成熟的技术栈：
          <br />
          * 前端：Vue3、TypeScript、Element Plus、自定义组件库<br />
          * 后端：Spring Boot、Spring Cloud、MyBatis-Plus、Sa-Token<br />
          * 存储：MySQL、Redis、MongoDB（按业务场景选型）<br />
          * 消息队列：RabbitMQ / RocketMQ / Kafka<br />
          * 文件存储：本地、Minio、各大云厂商对象存储<br />
          * 日志与监控：SkyWalking、Prometheus、Grafana、ELK<br />
          * 自动化运维：Docker、Kubernetes、CI/CD 流水线<br />
          <br />
          在此基础上，我们沉淀了一套适配企业级项目的<br />
          <b>权限管理、短信网关、短链跳转、风控拦截、审计日志</b> 等通用能力组件，<br />
          可以快速落地你的业务需求。
        </p>
        <p><b>当前系统:</b> <span>内部管理平台 · 短信 & 短链运营后台</span></p>
        <p>
          <el-tag type="danger">内部系统 · 请注意账号与数据安全</el-tag>
        </p>
        <p>
          <el-button
            type="primary"
            icon="Monitor"
            plain
            @click="goTarget('https://www.example.com/cases')"
          >
            成功案例
          </el-button>
          <el-button
            type="primary"
            icon="HelpFilled"
            plain
            @click="goTarget('https://www.example.com/help')"
          >
            使用指南
          </el-button>
        </p>
      </el-col>
    </el-row>
    <el-divider />
  </div>
</template>

<script setup name="Index" lang="ts">
const goTarget = (url: string) => {
  window.open(url, '__blank');
};
</script>

<style lang="scss" scoped>
.home {
  blockquote {
    padding: 10px 20px;
    margin: 0 0 20px;
    font-size: 17.5px;
    border-left: 5px solid #eee;
  }
  hr {
    margin-top: 20px;
    margin-bottom: 20px;
    border: 0;
    border-top: 1px solid #eee;
  }
  .col-item {
    margin-bottom: 20px;
  }

  ul {
    padding: 0;
    margin: 0;
  }

  font-family: 'open sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  font-size: 13px;
  color: #676a6c;
  overflow-x: hidden;

  ul {
    list-style-type: none;
  }

  h4 {
    margin-top: 0px;
  }

  h2 {
    margin-top: 10px;
    font-size: 26px;
    font-weight: 100;
  }

  p {
    margin-top: 10px;

    b {
      font-weight: 700;
    }
  }

  .update-log {
    ol {
      display: block;
      list-style-type: decimal;
      margin-block-start: 1em;
      margin-block-end: 1em;
      margin-inline-start: 0;
      margin-inline-end: 0;
      padding-inline-start: 40px;
    }
  }
}
</style>
