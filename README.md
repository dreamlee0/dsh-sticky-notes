# dsh-sticky-notes / 便利贴日历

DeepSeek Harness (DSH) Web UI 插件：左侧便利贴备忘录，右侧自然风月历，日程按日期显示在日历上。

A sticky-note memo board with a natural-toned month calendar, mounted as a sidebar panel in the DeepSeek Harness Web UI.

## 安装 / Install

```
dsh plugin --profile web add github:dreamlee0/dsh-sticky-notes
```

Desktop profile uses the same command with `--profile desktop`. Restart `dsh web` (or the Desktop app) after installing; the panel icon appears in the left rail.

## 功能 / Features

- **便利贴墙**：新建便签时可设日期、时间、颜色；右上角圆圈即对勾，点一下完成。
- **完成记录**：打勾不会删除数据——记录保留 `done: true` 与完成时间戳，切到「已完成」标签可查看并恢复。
- **未完成 / 已完成** 两个标签，「全部 / 当天」筛选对两者都生效。
- **当前时间卡**：数字时钟（时:分:秒）+ 一只会走的指针钟表（时/分/秒针实时转动），下方是今日 / 本月 / 已完成统计。
- **紧凑月历**：日期数字放大居中；有安排的日子在数字四周显示彩色小方块（对应便签纸色，悬停看内容，超过 4 条显示 `+N`）；今天用红色手绘圈圈出。
- **当日日程**：月历下方列出所选日期的全部安排，右侧对勾可切换完成状态。
- **中英双语**，跟随 DSH 语言设置；容器与文字使用 `--dsw-alias-*` 主题变量，自动适配浅色 / 深色主题。

| 左栏便利贴墙 | 右栏时间卡 + 月历 |
|---|---|
| 未完成 / 已完成标签、颜色纸、对勾 | 实时时钟、红圈今天、彩色小方块、当日日程 |

## 数据存储 / Storage

便利贴由两层保存：

1. **本机文件（主存储）**：Host 半端把数据写到 `$DSH_HOME/memo-calendar/notes.json`，并通过 `/memo-calendar/state` 路由与页面同步。桌面端每次启动的本地端口可能不同，文件存储保证重启、换浏览器后笔记仍在。
2. **浏览器 localStorage（缓存/兜底）**：键 `dsh.memo-calendar.v1`，打开面板先立即显示缓存，再与 Host 文件按 `updatedAt` 取较新的一份；无 Web 载体或路由不可用时面板仍可使用。

面板底部显示当前状态；无论哪种状态都可以用 **导出备份 / 导入**（JSON）迁移数据。

## 结构 / Layout

| 文件 | 作用 |
|---|---|
| `package.json` | 包清单：`dsh.bundle.patch` + `dsh.client`（web） |
| `cordis.patch.yml` | 插入 Loader 行 `memo-calendar` |
| `index.js` | Host 半端：`/memo-calendar/state` 路由 + `notes.json` 原子读写 |
| `client.js` | 浏览器半端：注册 `sidebar.panellist` 图标与 `main` 面板 |
| `locale/*.json` | 插件列表中的标题与描述（zh / en） |
| `icon.svg` / `assets/icon-180.png` | 插件图标（原创矢量图与 180px 位图） |

## 兼容性 / Compatibility

面向 DSH 0.2.x Web / Desktop 的 slot 机制（`sidebar.panellist`、`main`、`ctx.locale`）。样式只使用 `--dsw-alias-*` 主题变量；便签纸色、苔绿配色与叶枝插画属于插件自身的插画配色。

Requires a DSH 0.2.x Web or Desktop profile. No build step, no runtime dependencies.

## License

MIT