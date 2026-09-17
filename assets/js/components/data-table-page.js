import { PageHeader } from './layout.js';
import { Tabs, Alert, Card } from './layout.js';
import { SearchBar, Table } from './table.js';

/** 后台列表页统一骨架：标题 + 页签 + 搜索 + 表格 + 提示 */
export function DataTablePage({
  title, desc, actions = '', tabs, search, columns, rows, empty, hint, extra = '',
}) {
  return [
    PageHeader({ title, desc, actions }),
    tabs ? Tabs(tabs) : '',
    search ? SearchBar(search) : '',
    extra,
    Card({ body: Table({ columns, rows, empty }) }),
    hint ? Alert(hint) : '',
  ].join('');
}
