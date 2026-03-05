# 方块自定义组件

| 组件名称 | 描述 |
| --- | --- |
| [farmersdelight:block_entity](#farmersdelightblock_entity) | 方块实体组件，用于初始化容器方块的名称标签 |
| [farmersdelight:cabinet](#farmersdelightblock_entity) | 橱柜组件，定义方块为橱柜。 |
| [farmersdelight:crop](#farmersdelightcrop) | 作物组件，处理普通作物的生长、骨粉催熟和收获 |
| [farmersdelight:dish](#farmersdelightdish) | 餐盘组件，用于处理方块食物交互。 |
| [farmersdelight:interact](#farmersdelightinteract) | 交互组件，触发通用交互事件监听。 |
| [farmersdelight:mushroom_cluster](#farmersdelightmushroom_cluster) | 菌落组件，处理菌落的生长和骨粉催熟 |
| [farmersdelight:pastry](#farmersdelightpastry) | 糕点组件，处理蛋糕类方块的切片和食用 |
| [farmersdelight:stove](#farmersdelightstove) | 炉灶组件，处理炉灶的点火、熄灭和烹饪逻辑 |

---

## 详细说明

### farmersdelight:block_entity

方块实体组件。在方块放置时初始化方块实体的名称标签。

###### Type: string

**示例：**

json
"farmersdelight:block_entity":"example:block_entity"


---

### farmersdelight:crop

作物组件。用于处理普通作物的生长、骨粉催熟和右键收获逻辑。

###### Type: object

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| loot | string | 是 | 战利品表路径 |
| state | object，见下文 | 是 | 作物状态定义（生长阶段属性名、最大年龄、收获后年龄） |

state字段：

| 字段              | 类型   | 必填 | 默认值 | 说明                 |
| ----------------- | ------ | ---- | ------ | -------------------- |
| name              | string | 是   |        | 生长状态名称         |
| age               | int    | 是   |        | 最大生长阶段         |
| age_after_harvest | int    | 否   | 0      | 右键收获后的生成状态 |

**示例：**

json
"farmersdelight:crop": {
    "loot": "loot_tables/farmersdelight/crops/farmersdelight_onion_riped.json",
    "state": {
        "name": "farmersdelight:growth",
        "age": 7
    }
},


---

### farmersdelight:dish

餐盘组件。用于处理放置的方块食物。

###### Type: object

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| servings | int | 否 | 1 | 总份数 |
| contents | string \| string[] | 是 |  | 使用后获得的物品id；值可为数组形式用于返回多个物品。 |
| utensil | string | 否 |  | 使用所需的餐具的物品id；当以 # 开头时，会识别为物品标签。此字段不填则默认所有物品（包括空手）均可与其交互。 |
| has_leftovers | boolean | 否 | false | 使用完是否保留剩余部分（如空盘子） |

**示例**：

json
"farmersdelight:dish": {
    "has_leftovers": true,
    "servings": 4,
    "contents": "farmersdelight:honey_glazed_ham",
    "utensil": "minecraft:bowl"
}


> 每次使用增加 farmersdelight:food_block_stage 状态，故若使用此组件，此方块食物需使用farmersdelight:food_block_stage状态。

---

### farmersdelight:interact

交互组件。可以触发use相关事件监听。

###### Type: object

**示例：**

json
"farmersdelight:interact":{}


---

### farmersdelight:mushroom_cluster

菌落组件。处理菌落自然生长以及骨粉催熟。仅允许放置在菌丝、灰化土等方块上。

###### type: object

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| maturity | int | 否 | 4 | 成熟阶段值 |
| mushroom | string | 是 |  | 被剪刀剪下的蘑菇物品id。 |
| mushtree | string | 否 |  | 在第一阶段使用骨粉有概率长成巨型蘑菇的结构名。 |
| offset | vector3 | 否 |  | 结构生成偏移量，若mushtree不为空，则此字段必填。 |

> 注：生长状态所对应的方块状态的名称应为 farmersdelight:growth。

---

### farmersdelight:pastry

糕点组件。处理蛋糕类方块（如苹果派）的切片和食用。手持小刀右键可切下一份糕点物品。直接右键可直接食用一份，恢复饱食度并获得速度效果。手持小刀破坏方块可掉落剩余的所有切片。

###### Type: object

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| slice | string | 切片物品 ID |
| counter | string | 记录剩余份数的方块状态键名 |
| servings | number | 总份数 |
| seals | number | 初始外观偏移（用于某些模型） |

---

### farmersdelight:stove

炉灶组件。既是方块实体也是交互方块。

Type: string

**示例：**

json
"farmersdelight:stove"："farmersdelight:stove"


> 注：值与方块id要保持一致，并且表示是否点燃的方块状态名要为farmersdelight:stove。
