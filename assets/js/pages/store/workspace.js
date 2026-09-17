import { pageCtx } from '../context.js';

export function pageSVerify() {
  const { db, C } = pageCtx();
  return C.PageHeader({ title: '门店核销台', desc: '扫码或输入核销码。重复拒绝。' })
    + C.Card({ body: C.Field({ label: '核销码', inner: C.Input({ id: 'v-code', placeholder: 'HX-8821 / YY-2011 / QD-3301' }), span2: true }) + C.Btn({ label: '核销', action: 'do-verify', primary: true, size: '' }) })
    + C.Card({
      title: '最近记录',
      body: C.Table({
        columns: ['时间', '码', '状态'],
        rows: db.verifies.slice(0, 8).map((v) => C.tr([v.at, v.code, C.Tag(v.status)])),
      }),
    });
}

export function pageSShift() {
  const { db, C } = pageCtx();
  const n = db.verifies.length;
  return C.PageHeader({ title: '交班汇总', desc: '简单交班，不做离线复杂缓存。' })
    + C.MetricGrid([C.Metric({ label: '本班核销', value: n }), C.Metric({ label: '失败重试', value: 0 })]);
}
