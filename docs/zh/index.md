# **农夫乐事基岩版附属开发文档**

## 物品

### 组件

| 组件名称 | 描述 |
| --- | --- |
| [`farmersdelight:consume_effects`](#farmersdelightconsume_effects) | 食用效果组件，在物品被消耗时为玩家施加指定状态效果 |
| [`farmersdelight:farmers_book`](#farmersdelightfarmers_book) | 农夫手册组件，使用物品时打开农夫手册界面 |
| [`farmersdelight:increase_production`](#farmersdelightincrease_production) | 增产组件，标记物品具有增产效果 |
| [`farmersdelight:knife`](#farmersdelightknife) | 小刀组件，提供小刀的挖掘掉落和南瓜雕刻功能 |
| [`farmersdelight:rice_seed`](#farmersdelightrice_seed) | 稻种组件，在水上的泥土方块上种植水稻 |
| [`farmersdelight:seed`](#farmersdelightseed) | 种子组件，标记物品为种子类型 |



---

#### `farmersdelight:farmers_book`

农夫手册组件。当玩家使用持有该组件的物品时，打开农夫手册 UI 界面。

**监听事件：** `onUse`

**行为：**
- 调用 `mainForm(player)` 打开农夫手册表单

---

#### `farmersdelight:increase_production`

增产组件。标记物品具有增产效果，具体增产逻辑由其他系统读取该标记实现。

> 当前为空实现，仅作为标记组件使用。

---

#### `farmersdelight:knife`

小刀组件。为小刀类物品提供自定义的挖掘掉落和南瓜雕刻功能。

**监听事件：** `onMineBlock`、`onUseOn`

**`onMineBlock` 行为：**
- 创造模式下不执行
- 调用 `spawnKnifeLoot` 生成小刀专属掉落物
- 对手持物品造成耐久损耗

**`onUseOn` 行为：**
- 仅对 `minecraft:pumpkin` 生效
- 将南瓜雕刻为面向玩家反方向的雕刻南瓜（`minecraft:carved_pumpkin`）
- 播放雕刻音效 `pumpkin.carve`
- 生成 4 个南瓜种子并施加弹射力
- 非创造模式下对手持物品造成耐久损耗

---

#### `farmersdelight:rice_seed

稻种组件。当玩家在水面下的泥土类方块上使用稻种时，将水方块替换为水稻方块。

**监听事件：** `onUseOn`

**触发条件：**
- 使用面必须为 `Direction.Up`
- 目标方块必须带有 `dirt` 标签
- 目标方块上方必须为静止水源（`minecraft:water`，`liquid_depth` = 0）

**行为：**
- 将水方块替换为 `farmersdelight:rice_block`
- 非创造模式下消耗 1 个手中物品

---

#### `farmersdelight:seed`

种子组件。标记物品为种子类型。

> 当前为空实现，仅作为标记组件使用。
