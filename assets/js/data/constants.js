export const LEVELS = [
  { id: 'l1', name: '游历者', alias: '普卡', discount: 0.98, threshold: 0, keep: 0, zones: ['craft'], nft: false, original: false },
  { id: 'l2', name: '鉴赏者', alias: '银卡', discount: 0.95, threshold: 3000, keep: 800, zones: ['craft', 'aesthetics'], nft: false, original: false },
  { id: 'l3', name: '知音者', alias: '金卡', discount: 0.92, threshold: 12000, keep: 3000, zones: ['craft', 'aesthetics', 'print'], nft: true, original: false },
  { id: 'l4', name: '传承者', alias: '黑钻', discount: 0.88, threshold: 50000, keep: 12000, zones: ['craft', 'aesthetics', 'print', 'original'], nft: true, original: true },
];

export const ZONES = [
  { id: 'craft', name: '轻引流文创', price: '68–680', need: 'l1' },
  { id: 'aesthetics', name: '中端美学', price: '680–6,800', need: 'l2' },
  { id: 'print', name: '名家版画', price: '6,800–28,000', need: 'l3' },
  { id: 'original', name: '收藏原作', price: '28,000+', need: 'l4' },
];

export const ACCOUNTS = [
  { id: 'admin', name: '平台超管', role: 'admin', mode: 'admin', avatar: '超', pass: 'demo' },
  { id: 'ops', name: '运营·林晚', role: 'ops', mode: 'admin', avatar: '运', pass: 'demo' },
  { id: 'finance', name: '财务·周衡', role: 'finance', mode: 'admin', avatar: '财', pass: 'demo' },
  { id: 'cs', name: '客服·小荷', role: 'cs', mode: 'admin', avatar: '客', pass: 'demo' },
  { id: 'store', name: '核销·工坊店员', role: 'store', mode: 'store', avatar: '核', pass: 'demo' },
  { id: 'painter', name: '红樽画院', role: 'merchant', mode: 'merchant', merchantId: 'M1', avatar: '画', pass: 'demo' },
  { id: 'craftshop', name: '牡丹笺社', role: 'merchant', mode: 'merchant', merchantId: 'M2', avatar: '笺', pass: 'demo' },
  { id: 'corp', name: '巨野文旅集团', role: 'enterprise', mode: 'enterprise', enterpriseId: 'E1', avatar: '企', pass: 'demo' },
  { id: 'corpsub', name: '文旅·采购助理', role: 'enterprise-sub', mode: 'enterprise', enterpriseId: 'E1', avatar: '子', pass: 'demo' },
];

export const MINI_MEMBERS = [
  { id: 'guest', name: '游客', role: 'guest', level: null, phone: '—' },
  { id: 'm1', name: '陈游历', role: 'member', level: 'l1', phone: '13800001001', spend: 860, growth: 860, cPoints: 86, birthday: '09-20' },
  { id: 'm2', name: '赵鉴赏', role: 'member', level: 'l2', phone: '13800001002', spend: 5280, growth: 5280, cPoints: 420, birthday: '03-02' },
  { id: 'm3', name: '孙知音', role: 'member', level: 'l3', phone: '13800001003', spend: 18600, growth: 18600, cPoints: 1860, birthday: '11-11' },
  { id: 'm4', name: '周传承', role: 'member', level: 'l4', phone: '13800001004', spend: 86200, growth: 86200, cPoints: 6200, birthday: '05-18' },
];

export const TITLES = {
  home: '工作台', merchants: '商家入驻', roles: '角色权限', members: '会员等级',
  'level-config': '升降级阈值', points: '双积分账本', product: '商品库',
  'product-audit': '上下架审核', prices: '价格中心', stock: '库存', codes: '一物一码',
  orders: '订单中心', aftersales: '退款退货', logistics: '物流轨迹', invoices: '发票申请',
  'verify-records': '核销记录', coupons: '营销券', newbie: '新人礼包', bills: '月度对账单',
  withdraws: '分账提现', recon: '支付对账', dashboard: '经营大盘', traces: '溯源查询',
  logs: '操作日志', venues: '场地预约', events: '活动报名', messages: '消息提醒',
  ceremonies: '仪式套餐', customs: '定制婚书', bulk: '政企批量', logos: 'LOGO 定制',
  inquiries: '大额询价', enterprises: '企业账号', claims: '对公认领', limited: '限量预售',
  reviews: '商品评价', ugc: 'UGC 打卡', invites: '好友拉新', tags: '标签分群',
  resources: '资源排期', launches: '新品联名', exchanges: '积分占档',
  'reports-goods': '商品分析', 'reports-member': '会员分析', 'reports-finance': '财务报表',
  audits: '审计日志',
  'p-home': '商家工作台', 'p-products': '本店商品', 'p-orders': '本店订单', 'p-stock': '本店库存',
  'p-cs': '客诉', 'p-bills': '分成账单', 'p-trace': '溯源维护', 'p-board': '经营看板',
  'p-exchange': '积分兑换排期', 'p-resource': '申请档期', 'p-launch': '新品提报', 'p-reviews': '评价回复',
  'e-home': '政企中心', 'e-bulk': '批量下单', 'e-logo': 'LOGO 提报', 'e-inquiry': '询价',
  'e-users': '企业子账号', 'e-claim': '对公进度',
  's-verify': '门店核销', 's-shift': '交班汇总',
  'mini-home': '首页', 'mini-zone': '专区', 'mini-search': '搜索', 'mini-detail': '商品',
  'mini-cart': '购物车', 'mini-checkout': '结算', 'mini-pay': '支付', 'mini-orders': '订单',
  'mini-order': '订单详情', 'mini-wallet': '卡包', 'mini-points': '积分', 'mini-mine': '我的',
  'mini-trace': '溯源', 'mini-book': '预约', 'mini-event': '活动', 'mini-ceremony': '仪式',
  'mini-custom': '定制', 'mini-review': '评价', 'mini-ugc': '打卡', 'mini-invite': '邀请',
  'mini-limited': '限量', 'mini-verify': '核销', 'mini-msg': '消息',
  'mini-privacy': '隐私与注销',
  artists: '画师档案', media: '素材库', splits: '分账流水', redeem: '积分兑换物',
  'e-invoice': '专票申请', 'p-event': '共创报名',
  'mini-redeem': '积分兑换', 'mini-nft': '数字藏品', 'mini-artist': '画师',
  'mini-invoice': '发票',
};

/** 固定角色包可见页面；超管不限制 */
export const ROLE_ALLOW = {
  ops: [
    'home', 'dashboard', 'merchants', 'roles', 'members', 'level-config', 'points',
    'product', 'product-audit', 'prices', 'stock', 'codes', 'orders', 'aftersales',
    'logistics', 'verify-records', 'coupons', 'newbie', 'redeem', 'traces',
    'venues', 'events', 'messages', 'ceremonies', 'customs',
    'bulk', 'logos', 'inquiries', 'enterprises', 'claims', 'limited',
    'reviews', 'ugc', 'invites', 'tags', 'resources', 'launches', 'exchanges',
    'logs', 'audits', 'artists', 'media', 'reports-goods', 'reports-member',
  ],
  finance: [
    'dashboard', 'bills', 'withdraws', 'recon', 'invoices', 'claims', 'logs', 'audits',
    'reports-finance', 'points', 'orders', 'splits',
  ],
  cs: ['home', 'orders', 'aftersales', 'messages', 'verify-records', 'reviews', 'members', 'ugc'],
};
