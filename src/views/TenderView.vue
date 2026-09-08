<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <div class="min-h-[calc(100vh-2.5rem)] bg-slate-50 px-4 py-10">
    <article class="card-panel mx-auto max-w-3xl p-6 sm:p-10">
      <p class="font-mono text-xs text-sec-600">SDGP370000000202602007474 · 2026-09-03</p>
      <h1 class="mt-3 font-display text-2xl leading-snug text-sec-950 sm:text-3xl">
        山东省住房和城乡建设厅2026年度系统密评项目竞争性磋商公告
      </h1>

      <div class="mt-6 grid gap-3 rounded-lg bg-slate-50 p-4 text-sm sm:grid-cols-2">
        <div>
          <p class="text-xs text-slate-500">项目发包方</p>
          <p class="mt-0.5 font-medium text-slate-800">山东省住房和城乡建设厅</p>
        </div>
        <div>
          <p class="text-xs text-slate-500">项目编号</p>
          <p class="mt-0.5 font-mono text-slate-800">SDGP370000000202602007474</p>
        </div>
        <div>
          <p class="text-xs text-slate-500">预算金额</p>
          <p class="mt-0.5 font-display text-lg text-sec-800">115 万元</p>
        </div>
        <div>
          <p class="text-xs text-slate-500">合同履行期限</p>
          <p class="mt-0.5 font-mono text-slate-800">60 天</p>
        </div>
      </div>

      <section class="mt-8">
        <h2 class="text-base font-semibold text-slate-900">摘要</h2>
        <p class="mt-2 text-sm leading-relaxed text-slate-600">
          受山东省住房和城乡建设厅委托，对2026年度系统密评项目进行竞争性磋商，预算115万元，合同履行期限60天。
          采购内容为信息系统商用密码应用安全性评估服务，要求供应商具备商用密码检测机构资质证书。
        </p>
      </section>

      <section class="mt-8">
        <h2 class="text-base font-semibold text-slate-900">技术要点</h2>
        <ul class="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-slate-600">
          <li>涵盖信息系统商用密码安全性评估，依据 GB/T 39786 等标准开展。</li>
          <li>供应商须具备商用密码检测机构资质证书。</li>
          <li>支持不见面开标与全流程电子招投标。</li>
          <li>交付需支撑资产密码基座、合规自评、测评协同与整改追踪能力建设。</li>
        </ul>
      </section>

      <section class="mt-8">
        <h2 class="text-base font-semibold text-slate-900">关键词</h2>
        <p class="mt-2 text-sm text-slate-600">
          山东省, 密评, 商用密码, 信息安全, 政府采购, 合规评估
        </p>
      </section>

      <section class="mt-8">
        <h2 class="text-base font-semibold text-slate-900">技术创新性</h2>
        <p class="mt-2 text-sm leading-relaxed text-slate-600">
          采用不见面开标与全流程电子招投标，提升政府采购效率与透明度。本演示系统将密评检查项数字化，
          结合浏览器端 sql.js 实现无服务器数据闭环，并通过 RBAC 区分超管、业务主管、基层经办与决策层视图。
        </p>
      </section>

      <section class="mt-8 rounded-lg border border-slate-200 bg-slate-50 p-4 text-xs leading-relaxed text-slate-500">
        <p class="font-medium text-slate-700">免责声明（摘要）</p>
        <p class="mt-2">
          本项目所涉数据信息均采集自互联网公开渠道发布的标讯公示信息；核心内容系基于公开数据的算法推演与自动化构造生成，
          不涉及国家秘密、商业秘密或未公开敏感信息。仅供技术研究与学习参考。
        </p>
      </section>

      <div class="mt-8 flex flex-wrap gap-3">
        <RouterLink to="/login" class="btn-primary">进入演示系统</RouterLink>
        <RouterLink to="/about" class="btn-secondary">关于本系统</RouterLink>
        <a
          href="https://github.com/softwarelink-net/sd-gov-mipe-26"
          target="_blank"
          rel="noopener noreferrer"
          class="btn-secondary"
        >GitHub 源码</a>
      </div>
    </article>
  </div>
</template>
