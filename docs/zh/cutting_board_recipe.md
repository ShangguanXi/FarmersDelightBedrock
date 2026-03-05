# **砧板配方**

砧板配方通过脚本中的 `CuttingBoardRecipeManager` 进行管理。玩家将物品放置在砧板上后，使用对应工具右键即可切割。

---

## 配方结构

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| ingredients | object | 是 | 输入材料，见 [ingredients](#ingredients) |
| result | array | 是 | 输出产物列表，见 [result](#result) |
| tool | object | 是 | 所需工具，见 [tool](#tool) |
| is_block_type | boolean | 否 | 输入材料是否为方块类型（默认 `false`），设为 `true` 时砧板上会以方块模型展示材料 |
| sound | string | 是 | 切割时播放的音效 ID |

---

### ingredients

输入材料。

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| item | string | 是 | 输入物品 ID |

**示例：**

```json
"ingredients": { "item": "minecraft:pumpkin" }
```

---

### result

输出产物列表。每个配方可以有多个产物。

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| item | string | 是 | | 输出物品 ID |
| count | int | 否 | 1 | 输出数量 |
| chance | float | 否 | 1.0 | 掉落概率，范围 0.0 ~ 1.0 |

**示例：**

```json
"result": [
    { "item": "farmersdelight:tomato_seeds", "count": 1 },
    { "item": "farmersdelight:tomato", "count": 1, "chance": 0.2 }
]
```

> 注：当 `chance` 小于 1.0 时，该产物有概率不掉落。

---

### tool

切割所需的工具，可通过物品 ID 或物品标签匹配。

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| item | string | 否 | 工具物品 ID（与 `tag` 二选一） |
| tag | string | 否 | 工具物品标签（与 `item` 二选一） |

**示例：**

```json
"tool": { "tag": "farmersdelight:is_knife" }
```

```json
"tool": { "tag": "minecraft:is_axe" }
```

---

## 完整配方示例

### 基础切割（刀切花获得染料）

```json
{
    "ingredients": { "item": "minecraft:poppy" },
    "result": [{ "item": "minecraft:red_dye", "count": 2 }],
    "tool": { "tag": "farmersdelight:is_knife" },
    "is_block_type": false,
    "sound": "use.wood"
}
```

### 带概率掉落的切割

```json
{
    "ingredients": { "item": "farmersdelight:wild_potatoes" },
    "result": [
        { "item": "minecraft:potatoes", "count": 1 },
        { "item": "minecraft:purple_dye", "count": 2, "chance": 0.5 }
    ],
    "tool": { "tag": "farmersdelight:is_knife" },
    "is_block_type": false,
    "sound": "use.wood"
}
```

### 方块类型切割（锄头砍树）

```json
{
    "ingredients": { "item": "minecraft:pumpkin" },
    "result": [{ "item": "farmersdelight:pumpkin_slice", "count": 4 }],
    "tool": { "tag": "farmersdelight:is_knife" },
    "is_block_type": true,
    "sound": "use.wood"
}
```

### 斧头剥树皮（多产物）

```json
{
    "ingredients": { "item": "minecraft:oak_log" },
    "result": [
        { "item": "farmersdelight:tree_bark", "count": 1 },
        { "item": "minecraft:stripped_oak_log", "count": 1 }
    ],
    "tool": { "tag": "minecraft:is_axe" },
    "is_block_type": true,
    "sound": "use.wood"
}
```

---

## 注册自定义配方

砧板配方通过 `ScriptEvent`（脚本事件）进行注册。附属模组需要发送 ID 为 `farmersdelight:cutting_board_recipe` 的脚本事件，消息体为 JSON 格式。

### 消息体结构

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| ingredients | object / array | 是 | | 输入材料，格式同 [ingredients](#ingredients) |
| tool | object | 是 | | 所需工具，格式同 [tool](#tool)，必须包含 `tag` 或 `item` |
| result | array | 是 | | 输出产物列表，格式同 [result](#result)，不可为空 |
| is_block_type | boolean | 否 | false | 输入材料是否为方块类型 |
| sound | string | 否 | `"use.wood"` | 切割时播放的音效 ID |
| exp | number | 否 | | 切割获得的经验值 |

### 示例命令

**基础注册：**

```
/scriptevent farmersdelight:cutting_board_recipe {"ingredients":{"item":"example:my_item"},"result":[{"item":"example:my_output","count":2}],"tool":{"tag":"farmersdelight:is_knife"},"sound":"use.wood"}
```

**方块类型切割：**

```
/scriptevent farmersdelight:cutting_board_recipe {"ingredients":{"item":"example:my_block"},"result":[{"item":"example:my_slice","count":4}],"tool":{"tag":"minecraft:is_axe"},"is_block_type":true,"sound":"use.wood"}
```

**带概率掉落：**

```
/scriptevent farmersdelight:cutting_board_recipe {"ingredients":{"item":"example:my_crop"},"result":[{"item":"example:seed","count":1},{"item":"example:extra","count":1,"chance":0.5}],"tool":{"tag":"farmersdelight:is_knife"},"sound":"use.wood"}
```

### 记分板批量注册机制

配方注册系统会在世界加载时自动检测所有名称（`displayName`）匹配 `farmersdelight_<名称>` 的记分板，并执行对应路径下的函数文件：

```
functions/farmersdelight/cutting_board_recipe_registries/<名称>.mcfunction
```

附属模组可以利用该机制，在函数文件中通过 `scriptevent` 命令批量注册砧板配方：

1. 创建一个 `displayName` 为 `farmersdelight_<你的模组名>` 的记分板
2. 在行为包中创建函数文件 `functions/farmersdelight/cutting_board_recipe_registries/<你的模组名>.mcfunction`
3. 在函数文件中编写注册命令：

```mcfunction
scriptevent farmersdelight:cutting_board_recipe {"ingredients":{"item":"example:item_a"},"result":[{"item":"example:output_a","count":2}],"tool":{"tag":"farmersdelight:is_knife"},"sound":"use.wood"}
scriptevent farmersdelight:cutting_board_recipe {"ingredients":{"item":"example:item_b"},"result":[{"item":"example:output_b","count":1}],"tool":{"tag":"minecraft:is_axe"},"is_block_type":true,"sound":"use.wood"}
```

> 世界加载后，系统会自动执行该函数文件，完成所有配方的注册。

---

## 粒子效果

砧板上放置物品后会显示对应的粒子效果。粒子名称由物品 ID 自动推导：

- 若物品属于 `minecraft` 命名空间，粒子名称为：`farmersdelight:minecraft_<物品名>`
  - 例：`minecraft:beef` → 粒子 `farmersdelight:minecraft_beef`
- 若物品属于其他命名空间，粒子名称与物品 ID 相同：`<命名空间>:<物品名>`
  - 例：`farmersdelight:cabbage` → 粒子 `farmersdelight:cabbage`

> **附属开发注意：** 如果你的附属模组添加了可在砧板上切割的新物品，需要在资源包的 `particles` 目录下创建对应的粒子文件，否则砧板上放置该物品时会因找不到粒子而报错。
>
> 粒子文件路径示例：`RP/particles/<命名空间>/<粒子名>.particle.json`
