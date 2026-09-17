import { MINI_MEMBERS } from './constants.js';

export function seed() {
    return {
      version: 4,
      now: '2026-09-17 14:30',
      config: {
        pointRate: 0.1,
        pointCashRate: 0.01,
        pointOrderCap: 0.3,
        pointDayCap: 200,
        noPointCats: ['original'],
        couponVsFull: 'mutex',
        memberDayWithCoupon: true,
        transferRate: 10,
        keepDays: 365,
        newUserGift: true,
        depositRefundable: true,
        auditKeepDays: 365,
      },
      tiers: [
        { id: 'T1', name: '入驻商家', rate: 0.82, note: '货款 82% / 平台 18%' },
        { id: 'T2', name: '优选商家', rate: 0.86, note: '货款 86% / 平台 14%' },
        { id: 'T3', name: '战略商家', rate: 0.90, note: '货款 90% / 平台 10%' },
        { id: 'T4', name: '联名共创', rate: 0.88, note: '货款 88% / 平台 12%' },
      ],
      merchants: [
        { id: 'M1', name: '红樽画院', contact: '王砚秋', phone: '13900001111', tier: 'T3', status: '通过', pPoints: 12800, account: '6212 **** 8891', license: '913717**MA3XXXX', idcard: '已传', copyright: '已传', applyAt: '2026-08-02', reason: '' },
        { id: 'M2', name: '牡丹笺社', contact: '李笺', phone: '13900002222', tier: 'T2', status: '通过', pPoints: 3600, account: '6212 **** 2203', license: '913717**MA3YYYY', idcard: '已传', copyright: '已传', applyAt: '2026-08-08', reason: '' },
        { id: 'M3', name: '菏泽工坊合作社', contact: '张泥', phone: '13900003333', tier: 'T1', status: '待审', pPoints: 0, account: '', license: '已传', idcard: '已传', copyright: '待补权属', applyAt: '2026-09-15', reason: '' },
      ],
      members: MINI_MEMBERS.filter((m) => m.role === 'member').map((m) => ({
        ...m, coupons: m.id === 'm1' ? ['C-NEW'] : m.id === 'm2' ? ['C-VIP'] : [], invitedBy: m.id === 'm1' ? 'm2' : '', tags: m.id === 'm4' ? ['收藏', '仪式'] : m.id === 'm2' ? ['研学', '礼品'] : ['研学'],
      })),
      products: [
        { id: 'P01', merchantId: 'M2', zone: 'craft', type: 'sku', name: '牡丹书签六件套', cover: '🔖', guide: 128, member: { l1: 125, l2: 122, l3: 118, l4: 112 }, stock: 86, locked: 2, status: '上架', spec: '红/金', story: '巨野牡丹纹样烫金。', freight: 8, noPoint: false, artistId: 'A2' },
        { id: 'P02', merchantId: 'M2', zone: 'craft', type: 'diy', name: '牡丹团扇 DIY 材料包', cover: '🪭', guide: 198, member: { l1: 194, l2: 188, l3: 182, l4: 174 }, stock: 40, locked: 0, status: '上架', spec: '单人', story: '到店核销，工坊老师带做。', freight: 0, noPoint: false, verify: true, artistId: 'A2' },
        { id: 'P03', merchantId: 'M2', zone: 'craft', type: 'card', name: '研学亲子月卡', cover: '🎫', guide: 680, member: { l1: 666, l2: 646, l3: 626, l4: 598 }, stock: 99, locked: 0, status: '上架', spec: '亲子', story: '30 日内可核销 4 次。', freight: 0, noPoint: false, verify: true, times: 4, artistId: 'A2' },
        { id: 'P04', merchantId: 'M1', zone: 'aesthetics', type: 'sku', name: '没骨牡丹小品装裱', cover: '🖼️', guide: 2680, member: { l1: 2626, l2: 2546, l3: 2466, l4: 2358 }, stock: 12, locked: 1, status: '上架', spec: '镜框', story: '画院青年画家合作款。', freight: 28, noPoint: false, artistId: 'A1' },
        { id: 'P05', merchantId: 'M1', zone: 'print', type: 'sku', name: '名家限量铜版画 No.12', cover: '🖨️', guide: 12800, member: { l1: 12544, l2: 12160, l3: 11776, l4: 11264 }, stock: 8, locked: 0, status: '上架', spec: '签名版', story: '限编 50，附证书。', freight: 0, noPoint: false, limited: true, limitPer: 1, saleAt: '2026-09-17 10:00', presale: false, artistId: 'A1' },
        { id: 'P06', merchantId: 'M1', zone: 'original', type: 'unique', name: '《月下红樽》原作', cover: '🌑', guide: 68000, member: { l1: 66640, l2: 64600, l3: 62560, l4: 59840 }, stock: 1, locked: 0, status: '上架', spec: '孤品', story: '一物一码 LY-2026-0007。黑钻可预约鉴赏。', freight: 0, noPoint: true, code: 'LY-2026-0007', trace: 'CZ-881920', artistId: 'A1' },
        { id: 'P07', merchantId: 'M2', zone: 'craft', type: 'sku', name: '文创帆布袋', cover: '👜', guide: 68, member: { l1: 66, l2: 64, l3: 62, l4: 59 }, stock: 0, locked: 0, status: '上架', spec: '米色', story: '售罄演示。', freight: 8, noPoint: false },
        { id: 'P08', merchantId: 'M1', zone: 'aesthetics', type: 'sku', name: '新作：金笺小品', cover: '📜', guide: 1680, member: { l1: 1646, l2: 1596, l3: 1546, l4: 1478 }, stock: 6, locked: 0, status: '待审', spec: '金笺', story: 'P 端新提交。', freight: 18, noPoint: false },
        { id: 'P09', merchantId: 'M1', zone: 'craft', type: 'ceremony', name: '全息订婚纪念套餐', cover: '💍', guide: 9800, member: { l1: 9800, l2: 9600, l3: 9400, l4: 9000 }, stock: 99, locked: 0, status: '上架', spec: '标准', story: '线上不定档，电话约档。定金 2000。', freight: 0, noPoint: false, deposit: 2000, phone: '0530-8886688' },
        { id: 'P10', merchantId: 'M2', zone: 'craft', type: 'custom', name: '牡丹婚嫁礼盒 / 定制婚书', cover: '💌', guide: 1280, member: { l1: 1254, l2: 1216, l3: 1178, l4: 1126 }, stock: 30, locked: 0, status: '上架', spec: '定制', story: '款式/文案/材质线上选。', freight: 12, noPoint: false },
        { id: 'P11', merchantId: 'M2', zone: 'craft', type: 'gift', name: '节庆伴手礼·牡丹十二色', cover: '🎁', guide: 268, member: { l1: 268, l2: 260, l3: 250, l4: 240 }, stock: 400, locked: 0, status: '上架', spec: '企业套', story: '政企批量，可分送。', freight: 0, noPoint: false },
        { id: 'P12', merchantId: 'M1', zone: 'print', type: 'sku', name: '预售：秋日牡丹铜版', cover: '🍂', guide: 8600, member: { l1: 8428, l2: 8170, l3: 7912, l4: 7568 }, stock: 20, locked: 0, status: '上架', spec: '预售', story: '付定金 2000 或全款。10-01 开售发货。', freight: 0, noPoint: false, limited: true, limitPer: 2, saleAt: '2026-10-01 10:00', presale: true, deposit: 2000 },
      ],
      codes: [
        { id: 'LY-2026-0007', productId: 'P06', status: '在售', owner: '', trace: 'CZ-881920' },
        { id: 'LY-2026-0008', productId: 'P06', status: '草稿', owner: '', trace: '' },
      ],
      coupons: [
        { id: 'C-NEW', name: '新人礼 20 元', type: 'cash', value: 20, min: 99, status: '可用', user: 'm1' },
        { id: 'C-VIP', name: '会员日满减 50', type: 'cash', value: 50, min: 300, status: '可用', user: 'm2' },
        { id: 'C-FULL', name: '满 200-30', type: 'full', value: 30, min: 200, status: '可领', user: '' },
      ],
      couponTpls: [
        { id: 'TPL1', name: '新人礼包', scene: '注册', value: 20, min: 99, once: true, status: '启用' },
        { id: 'TPL2', name: '会员日满减', scene: '会员日', value: 50, min: 300, once: false, status: '启用' },
        { id: 'TPL3', name: '晋级礼券', scene: '升级', value: 80, min: 0, once: true, status: '启用' },
      ],
      memberDay: { on: true, until: '2026-09-20', extraOff: 0.02 },
      cart: [],
      orders: [
        { id: 'O20260915001', userId: 'm2', merchantId: 'M2', type: '购物单', status: '待发货', pay: '微信已付', payNo: 'WX20260915A', items: [{ productId: 'P01', qty: 2, price: 122 }], amount: 252, freight: 8, coupon: 0, points: 0, fulfill: '快递', created: '2026-09-15 11:20', express: '', invoice: '' },
        { id: 'O20260917005', userId: 'm2', merchantId: 'M2', type: '购物单', status: '待支付', pay: '待支付', payNo: '', items: [{ productId: 'P01', qty: 1, price: 122 }], amount: 122, freight: 8, coupon: 0, points: 0, fulfill: '快递', created: '2026-09-16 09:00', express: '', lockedAt: '2026-09-16 09:00' },
        { id: 'O20260911006', userId: 'm2', merchantId: 'M2', type: '核销单', status: '待核销', pay: '微信已付', payNo: 'WX20260911E', items: [{ productId: 'P03', qty: 1, price: 646 }], amount: 646, freight: 0, coupon: 0, points: 0, fulfill: '到店核销', verifyCode: 'KD-4408', timesLeft: 3, times: 4, created: '2026-09-11 10:00', express: '' },
        { id: 'O20260916002', userId: 'm1', merchantId: 'M2', type: '核销单', status: '待核销', pay: '微信已付', payNo: 'WX20260916B', items: [{ productId: 'P02', qty: 1, price: 194 }], amount: 194, freight: 0, coupon: 0, points: 0, fulfill: '到店核销', verifyCode: 'HX-8821', created: '2026-09-16 09:10', express: '' },
        { id: 'O20260912003', userId: 'm4', merchantId: 'M1', type: '购物单', status: '已完成', pay: '微信已付', payNo: 'WX20260912C', items: [{ productId: 'P04', qty: 1, price: 2358 }], amount: 2358, freight: 28, coupon: 0, points: 200, fulfill: '快递', created: '2026-09-12 16:02', express: 'SF6011223344', trace: ['已揽收', '运输中', '已签收'] },
        { id: 'O20260910004', userId: 'm3', merchantId: 'M1', type: '购物单', status: '售后中', pay: '微信已付', payNo: 'WX20260910D', items: [{ productId: 'P04', qty: 1, price: 2466 }], amount: 2466, freight: 28, coupon: 0, points: 0, fulfill: '快递', created: '2026-09-10 13:40', express: 'YT998877' },
      ],
      aftersales: [
        { id: 'AS01', orderId: 'O20260910004', type: '仅退款', status: '待审', reason: '重复下单', amount: 2494, artOverride: false, created: '2026-09-16 18:01' },
      ],
      invoices: [
        { id: 'INV01', orderId: 'O20260912003', kind: '个人', title: '周传承', tax: '', status: '已回填', no: '2444200000123' },
        { id: 'INV02', orderId: '', kind: '专票', title: '巨野文旅集团有限公司', tax: '91371700MA3CORP1', status: '待开', no: '' },
      ],
      verifies: [
        { id: 'V01', code: 'HX-7700', orderId: 'O-OLD', user: '陈游历', status: '已核销', at: '2026-09-08 14:22', by: 'store' },
      ],
      pointsC: [
        { id: 1, userId: 'm2', delta: 252, type: '获取', orderId: 'O20260915001', note: '消费入账', at: '2026-09-15 11:21' },
        { id: 2, userId: 'm4', delta: -200, type: '消耗', orderId: 'O20260912003', note: '抵现', at: '2026-09-12 16:02' },
      ],
      pointsP: [
        { id: 1, merchantId: 'M1', delta: 800, type: '分成入账', orderId: 'O20260912003', note: '货款积分', at: '2026-09-12 16:10' },
      ],
      bills: [
        { id: 'B-202608-M1', merchantId: 'M1', month: '2026-08', gmv: 126800, share: 114120, platform: 12680, status: '已出账', appeal: '' },
        { id: 'B-202608-M2', merchantId: 'M2', month: '2026-08', gmv: 18660, share: 16047, platform: 2613, status: '已出账', appeal: '' },
      ],
      withdraws: [
        { id: 'W01', merchantId: 'M1', amount: 20000, status: '待财务审', at: '2026-09-16 10:00' },
      ],
      recon: [
        { id: 'R01', date: '2026-09-16', channel: 12880, orders: 12880, diff: 0, status: '平' },
        { id: 'R02', date: '2026-09-15', channel: 252, orders: 252, diff: 0, status: '平' },
        { id: 'R03', date: '2026-09-14', channel: 980, orders: 880, diff: 100, status: '差异' },
      ],
      traces: [
        { code: 'LY-2026-0007', title: '《月下红樽》', artist: '王砚秋', year: '2026', chain: '甲方存证 CZ-881920', result: '真品在库' },
      ],
      venues: [
        { id: 'VN1', name: '全息婚礼堂', cap: 40 },
        { id: 'VN2', name: '研学课堂 A', cap: 16 },
        { id: 'VN3', name: '艺术沙龙', cap: 24 },
        { id: 'VN4', name: 'DIY 工坊 1', cap: 12 },
      ],
      slots: [
        { id: 'S1', venueId: 'VN4', date: '2026-09-20', time: '14:00-16:00', cap: 12, used: 6 },
        { id: 'S2', venueId: 'VN4', date: '2026-09-20', time: '16:00-18:00', cap: 12, used: 12 },
        { id: 'S3', venueId: 'VN2', date: '2026-09-21', time: '09:30-11:30', cap: 16, used: 4 },
        { id: 'S4', venueId: 'VN1', date: '2026-09-28', time: '18:00-21:00', cap: 40, used: 0 },
        { id: 'S5', venueId: 'VN3', date: '2026-09-22', time: '19:00-21:00', cap: 24, used: 10 },
      ],
      bookings: [
        { id: 'BK01', userId: 'm2', slotId: 'S1', people: 2, status: '成功', verifyCode: 'YY-2011', at: '2026-09-16 12:00' },
      ],
      events: [
        { id: 'EV1', name: '九月牡丹夜场策展', date: '2026-09-26 19:00', cap: 30, used: 30, wait: 2, need: 'l2', mix: false, tags: [] },
        { id: 'EV2', name: '画师见面会·王砚秋', date: '2026-09-27 14:00', cap: 40, used: 18, wait: 0, need: 'l1', mix: true, tags: [] },
        { id: 'EV3', name: '黑钻专场鉴赏夜', date: '2026-09-29 19:30', cap: 12, used: 4, wait: 0, need: 'l4', mix: false, tags: ['收藏'] },
      ],
      signups: [
        { id: 'SG01', eventId: 'EV1', userId: 'm2', status: '候补', queue: 1, code: '', at: '2026-09-16 20:00' },
        { id: 'SG02', eventId: 'EV1', userId: 'm3', status: '成功', queue: 0, code: 'QD-3301', at: '2026-09-12 09:00' },
        { id: 'SG03', eventId: 'EV3', userId: 'm4', status: '成功', queue: 0, code: 'QD-4401', at: '2026-09-14 11:00' },
      ],
      ceremonies: [
        { id: 'CM01', userId: 'm4', productId: 'P09', status: '已收定金', deposit: 2000, balance: 7800, paidDeposit: 2000, paidBalance: 0, phone: '0530-8886688', deliver: false, at: '2026-09-10 15:00' },
      ],
      customs: [
        { id: 'CU01', userId: 'm2', productId: 'P10', style: '卷轴', text: '百年好合 · 红樽揽月', material: '金笺', status: '制作中', at: '2026-09-13 10:20' },
      ],
      enterprises: [
        { id: 'E1', name: '巨野文旅集团', credit: '91371700MA3CORP1', vipPrice: true, priority: true, master: 'corp', vipPrices: { P11: 238 } },
      ],
      enterpriseUsers: [
        { id: 'corp', name: '主账号·采购总监', ent: 'E1', role: '主账号' },
        { id: 'corpsub', name: '子账号·助理', ent: 'E1', role: '子账号' },
      ],
      bulkOrders: [
        { id: 'BO01', ent: 'E1', productId: 'P11', qty: 200, amount: 53600, status: '待对公认领', addresses: 2, addressList: ['巨野文旅大楼收发室', '菏泽办事处'], at: '2026-09-14 09:00' },
      ],
      logos: [
        { id: 'LG01', ent: 'E1', qty: 500, logo: '文旅Logo.ai', due: '2026-10-08', status: '设计确认', quote: 18600, at: '2026-09-11' },
      ],
      inquiries: [
        { id: 'IQ01', ent: 'E1', title: '春节伴手礼 2000 套', qty: 2000, status: '待审批', ladders: [{ n: 500, p: 258 }, { n: 1000, p: 248 }, { n: 2000, p: 238 }], valid: '2026-09-25', at: '2026-09-15' },
      ],
      claims: [
        { id: 'CL01', ent: 'E1', amount: 53600, memo: '文旅中秋礼', status: '待认领', orderId: 'BO01' },
      ],
      reviews: [
        { id: 'RV01', productId: 'P01', userId: 'm2', score: 5, text: '烫金很稳，送礼够体面。', status: '待审', reply: '', at: '2026-09-16' },
        { id: 'RV02', productId: 'P04', userId: 'm4', score: 5, text: '装裱干净，画院回复及时。', status: '已过审', reply: '感谢抬爱，新作月底上架。', at: '2026-09-13' },
      ],
      ugc: [
        { id: 'UG01', userId: 'm1', event: '工坊打卡', text: '第一次做团扇', status: '待审', points: 20, at: '2026-09-16' },
      ],
      invites: [
        { id: 'IN01', from: 'm2', to: 'm1', status: '已首单', points: 50 },
      ],
      tagRules: [
        { id: 'TR1', name: '研学客', when: '核销 DIY/研学卡 ≥1', auto: true },
        { id: 'TR2', name: '收藏客', when: '原作/版画成交', auto: true },
        { id: 'TR3', name: '仪式客', when: '浏览/下定仪式套餐', auto: true },
        { id: 'TR4', name: '礼品客', when: '购物车含伴手礼', auto: true },
      ],
      segments: [
        { id: 'SEG1', name: '金卡及以上·收藏意向', count: 2, tags: ['收藏'] },
        { id: 'SEG2', name: '研学亲子', count: 18, tags: ['研学'] },
      ],
      resources: [
        { id: 'RS1', kind: '裸眼大屏', date: '2026-09-24', time: '18:00-20:00', merchantId: 'M1', status: '已占用' },
        { id: 'RS2', kind: '直播排期', date: '2026-09-25', time: '20:00-21:00', merchantId: '', status: '空闲' },
        { id: 'RS3', kind: '展位 A3', date: '2026-10-01', time: '全天', merchantId: '', status: '空闲' },
      ],
      resourceApps: [
        { id: 'RA01', merchantId: 'M2', resourceId: 'RS1', status: '冲突驳回', at: '2026-09-16' },
        { id: 'RA02', merchantId: 'M2', resourceId: 'RS2', status: '待审', at: '2026-09-17' },
      ],
      launches: [
        { id: 'LN01', merchantId: 'M1', title: '联名：文旅×画院秋日', status: '待审', at: '2026-09-15' },
      ],
      exchanges: [
        { id: 'EX01', merchantId: 'M1', item: '展位 A3', cost: 2000, status: '待占档', resourceId: 'RS3' },
      ],
      audits: [
        { id: 'AU01', who: 'ops', action: '通过商家入驻 牡丹笺社', at: '2026-08-08 10:12', cat: '入驻审核' },
        { id: 'AU02', who: 'ops', action: '改价 P04 指导价 2680', at: '2026-09-01 09:00', cat: '改价' },
      ],
      notifications: [
        { id: 'N1', title: '待审商品 1 件', body: '金笺小品待运营审核', time: '09:12', read: false, go: 'product-audit' },
        { id: 'N2', title: '对账差异 100 元', body: '9月14日渠道多出 100', time: '08:02', read: false, go: 'recon' },
        { id: 'N3', title: '候补可递补', body: '九月夜场有人取消，可转正', time: '昨天', read: true, go: 'events' },
      ],
      messages: [
        { id: 'MSG1', to: 'm2', title: '预约成功', body: 'DIY 工坊 9/20 14:00，凭证 YY-2011', at: '2026-09-16 12:00' },
        { id: 'MSG2', to: 'm2', title: '候补中', body: '九月牡丹夜场满员，您排第 1 位', at: '2026-09-16 20:00' },
      ],
      logs: [],
      artists: [
        { id: 'A1', name: '王砚秋', shop: 'M1', bio: '红樽画院驻院画家，没骨牡丹。', works: 18 },
        { id: 'A2', name: '李笺', shop: 'M2', bio: '牡丹纹样与研学课程设计。', works: 42 },
      ],
      media: [
        { id: 'MD1', kind: '图', name: '书签主图', used: 'P01', status: '已审' },
        { id: 'MD2', kind: '视频', name: '工坊过程', used: 'P02', status: '已审' },
        { id: 'MD3', kind: '故事', name: '月下红樽创作记', used: 'P06', status: '已审' },
      ],
      redeemItems: [
        { id: 'R1', name: 'DIY 体验券', cost: 80, kind: '核销凭证' },
        { id: 'R2', name: '书签小样', cost: 40, kind: '核销凭证' },
        { id: 'R3', name: '研学单次体验', cost: 120, kind: '核销凭证' },
        { id: 'R4', name: '工坊茶点券', cost: 30, kind: '核销凭证' },
        { id: 'R5', name: '展览票根', cost: 60, kind: '核销凭证' },
        { id: 'R6', name: '金笺试笔条', cost: 50, kind: '核销凭证' },
      ],
      redeemVouchers: [],
      splits: [
        { id: 'SP01', orderId: 'O20260915001', merchantId: 'M2', goods: 252, merchant: 217, platform: 35, status: '已调甲方清分', at: '2026-09-15 11:22' },
      ],
      roles: [
        { id: 'admin', name: '超管', menus: '*' },
        { id: 'ops', name: '运营', menus: '商品/会员/营销/预约/审核' },
        { id: 'finance', name: '财务', menus: '对账/发票/提现/认领' },
        { id: 'cs', name: '客服', menus: '订单/售后/工单' },
        { id: 'store', name: '仓店核销', menus: '核销/交班' },
        { id: 'merchant', name: 'P端商家', menus: '本店商品订单库存分成' },
        { id: 'enterprise', name: '政企主账号', menus: '批量/询价/子账号' },
      ],
    };
  }
