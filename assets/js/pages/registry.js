import { pageHome } from './admin/home.js';
import * as account from './admin/account.js';
import * as goods from './admin/goods.js';
import * as trade from './admin/trade.js';
import * as finance from './admin/finance.js';
import * as booking from './admin/booking.js';
import * as phase2 from './admin/phase2.js';
import * as content from './admin/content.js';
import * as merchant from './merchant/workspace.js';
import * as ent from './enterprise/workspace.js';
import * as store from './store/workspace.js';
import * as miniShop from './mini/shop.js';
import * as miniTrade from './mini/trade.js';
import * as miniMine from './mini/mine.js';
import * as miniLife from './mini/life.js';

const PAGES = {
  home: pageHome,
  merchants: account.pageMerchants,
  roles: account.pageRoles,
  members: account.pageMembers,
  'level-config': account.pageLevelConfig,
  points: account.pagePoints,
  product: goods.pageProducts,
  'product-audit': goods.pageProductAudit,
  prices: goods.pagePrices,
  stock: goods.pageStock,
  codes: goods.pageCodes,
  orders: trade.pageOrders,
  aftersales: trade.pageAftersales,
  logistics: trade.pageLogistics,
  invoices: trade.pageInvoices,
  'verify-records': trade.pageVerifyRecords,
  coupons: finance.pageCoupons,
  newbie: finance.pageNewbie,
  bills: finance.pageBills,
  withdraws: finance.pageWithdraws,
  recon: finance.pageRecon,
  dashboard: finance.pageDashboard,
  traces: finance.pageTraces,
  logs: finance.pageLogs,
  audits: finance.pageLogs,
  venues: booking.pageVenues,
  events: booking.pageEvents,
  messages: booking.pageMessages,
  ceremonies: booking.pageCeremonies,
  customs: booking.pageCustoms,
  bulk: phase2.pageBulk,
  logos: phase2.pageLogos,
  inquiries: phase2.pageInquiries,
  enterprises: phase2.pageEnterprises,
  claims: phase2.pageClaims,
  limited: phase2.pageLimited,
  resources: phase2.pageResources,
  launches: phase2.pageLaunches,
  exchanges: phase2.pageExchanges,
  reviews: content.pageReviews,
  ugc: content.pageUgc,
  invites: content.pageInvites,
  tags: content.pageTags,
  'reports-goods': content.pageReportsGoods,
  'reports-member': content.pageReportsMember,
  'reports-finance': content.pageReportsFinance,
  'p-home': merchant.pagePHome,
  'p-products': merchant.pagePProducts,
  'p-orders': merchant.pagePOrders,
  'p-stock': merchant.pagePStock,
  'p-cs': merchant.pagePCs,
  'p-bills': merchant.pagePBills,
  'p-trace': merchant.pagePTrace,
  'p-board': merchant.pagePBoard,
  'p-exchange': merchant.pagePExchange,
  'p-resource': merchant.pagePResource,
  'p-launch': merchant.pagePLaunch,
  'p-reviews': merchant.pagePReviews,
  'e-home': ent.pageEHome,
  'e-bulk': ent.pageEBulk,
  'e-logo': ent.pageELogo,
  'e-inquiry': ent.pageEInquiry,
  'e-users': ent.pageEUsers,
  'e-claim': ent.pageEClaim,
  's-verify': store.pageSVerify,
  's-shift': store.pageSShift,
  'mini-home': miniShop.pageMiniHome,
  'mini-zone': miniShop.pageMiniZone,
  'mini-search': miniShop.pageMiniSearch,
  'mini-detail': miniShop.pageMiniDetail,
  'mini-trace': miniShop.pageMiniTrace,
  'mini-cart': miniTrade.pageMiniCart,
  'mini-checkout': miniTrade.pageMiniCheckout,
  'mini-pay': miniTrade.pageMiniPay,
  'mini-orders': miniTrade.pageMiniOrders,
  'mini-order': miniTrade.pageMiniOrder,
  'mini-mine': miniMine.pageMiniMine,
  'mini-wallet': miniMine.pageMiniWallet,
  'mini-points': miniMine.pageMiniPoints,
  'mini-privacy': miniMine.pageMiniPrivacy,
  'mini-msg': miniMine.pageMiniMsg,
  'mini-invite': miniMine.pageMiniInvite,
  'mini-review': miniMine.pageMiniReview,
  'mini-ugc': miniMine.pageMiniUgc,
  'mini-book': miniLife.pageMiniBook,
  'mini-event': miniLife.pageMiniEvent,
  'mini-ceremony': miniLife.pageMiniCeremony,
  'mini-limited': miniLife.pageMiniLimited,
  'mini-verify': miniLife.pageMiniVerify,
};

export function getPage(id) {
  return PAGES[id];
}
