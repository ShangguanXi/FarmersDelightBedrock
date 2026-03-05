# **厨锅配方**

厨锅配方通过脚本中的 `CookingPotRecipe`（继承自 `RecipeHolder`）进行管理。玩家将原料放入厨锅后，在下方提供热源即可自动烹饪。

---

## 配方结构

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| identifer | string | 是 | | 配方唯一标识符，格式为 `命名空间:配方名` |
| tags | string[] | 是 | | 配方标签列表，厨锅配方需包含 `"cooking_pot"` |
| priority | int | 否 | 0 | 优先级，数值越大优先级越高。同一标识符的配方会保留优先级更高的版本 |
| time | int | 是 | | 烹饪所需时间（单位为 tick，20 tick = 1 秒） |
| experience | float | 否 | 0 | 烹饪获得的经验值 |
| ingredients | array | 是 | | 输入原料列表（最多 6 个），见 [ingredients](#ingredients) |
| result | object | 是 | | 输出产物，见 [result](#result) |
| container | object | 否 | | 取出产物所需的容器物品，见 [container](#container) |
| recipe_book_tab | string | 否 | | 在配方书中的分类标签（如 `"meals"`、`"drinks"`、`"misc"`），暂时无用 |

---

### ingredients

输入原料列表。每个元素可以是单个原料，也可以是一个数组表示"多选一"。

#### 单个原料

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| item | string | 否 | 物品 ID（与 `tag` 二选一） |
| tag | string | 否 | 物品标签（与 `item` 二选一） |

#### 多选一原料

当一个原料槽位可以接受多种物品时，使用数组形式：

```json
[
    { "item": "minecraft:porkchop" },
    { "item": "minecraft:beef" },
    { "tag": "farmersdelight:is_raw_porkchop" }
]
```

> 数组中的任意一种物品/标签均可满足该槽位的需求。

**示例：**

```json
"ingredients": [
    { "item": "minecraft:red_mushroom" },
    { "item": "minecraft:bone" }
]
```

```json
"ingredients": [
    [
        { "tag": "farmersdelight:is_raw_beef" },
        { "item": "minecraft:beef" }
    ],
    { "item": "minecraft:carrot" },
    { "item": "minecraft:potato" }
]
```

---

### result

输出产物。

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| item | string | 是 | | 输出物品 ID |
| count | int | 否 | 1 | 输出数量（对应 `amount` 字段） |

**示例：**

```json
"result": {
    "item": "farmersdelight:beef_stew"
}
```

```json
"result": {
    "item": "farmersdelight:dumplings",
    "count": 2
}
```

---

### container

取出产物时需要使用的容器物品。若配方定义了 `container`，玩家需要手持该容器物品才能从厨锅中取出产物。

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| item | string | 是 | 容器物品 ID |

**示例：**

```json
"container": {
    "item": "minecraft:bowl"
}
```

> 若配方不包含 `container` 字段，产物可直接取出。

---

## 完整配方示例

### 基础配方（带容器）

```json
{
    "identifer": "farmersdelight:bone_broth",
    "tags": ["cooking_pot"],
    "priority": 0,
    "time": 200,
    "container": {
        "item": "minecraft:bowl"
    },
    "ingredients": [
        { "item": "minecraft:red_mushroom" },
        { "item": "minecraft:bone" }
    ],
    "result": {
        "item": "farmersdelight:bone_broth"
    }
}
```

### 多选一原料配方

```json
{
    "identifer": "farmersdelight:beef_stew",
    "tags": ["cooking_pot"],
    "priority": 0,
    "time": 200,
    "experience": 1.0,
    "container": {
        "item": "minecraft:bowl"
    },
    "ingredients": [
        [
            { "tag": "farmersdelight:is_raw_beef" },
            { "item": "minecraft:beef" }
        ],
        { "item": "minecraft:carrot" },
        { "item": "minecraft:potato" }
    ],
    "recipe_book_tab": "meals",
    "result": {
        "item": "farmersdelight:beef_stew"
    }
}
```

### 多数量产出配方

```json
{
    "identifer": "farmersdelight:dumplings",
    "tags": ["cooking_pot"],
    "priority": 0,
    "time": 200,
    "experience": 1.0,
    "ingredients": [
        [
            { "item": "minecraft:porkchop" },
            { "item": "minecraft:beef" },
            { "item": "minecraft:chicken" },
            { "tag": "farmersdelight:is_raw_porkchop" }
        ],
        [
            { "tag": "farmersdelight:is_cabbage" }
        ],
        [
            { "tag": "farmersdelight:is_onion" }
        ],
        [
            { "tag": "farmersdelight:is_dough" }
        ]
    ],
    "recipe_book_tab": "misc",
    "result": {
        "item": "farmersdelight:dumplings",
        "count": 2
    }
}
```

---

## 注册自定义配方

厨锅配方通过 `ScriptEvent`（脚本事件）进行注册。附属模组需要发送 ID 为 `farmersdelight:cooking_pot_recipe` 的脚本事件，消息体为完整的配方 JSON。

### 消息体结构

消息体即为完整的 [配方结构](#配方结构)，其中 `time`、`ingredients`、`result` 为必填字段（`result` 中必须包含 `item` 字段，`ingredients` 不可为空数组）。

### 示例命令

**基础配方（带容器）：**

```
/scriptevent farmersdelight:cooking_pot_recipe {"identifer":"example:my_stew","tags":["cooking_pot"],"time":200,"experience":1.0,"container":{"item":"minecraft:bowl"},"ingredients":[{"item":"example:ingredient_a"},{"item":"example:ingredient_b"}],"result":{"item":"example:my_stew"}}
```

**多选一原料配方：**

```
/scriptevent farmersdelight:cooking_pot_recipe {"identifer":"example:my_soup","tags":["cooking_pot"],"time":200,"ingredients":[[{"item":"minecraft:beef"},{"item":"minecraft:porkchop"}],{"item":"minecraft:carrot"}],"result":{"item":"example:my_soup"},"container":{"item":"minecraft:bowl"}}
```

**覆盖原版配方（高优先级）：**

```
/scriptevent farmersdelight:cooking_pot_recipe {"identifer":"farmersdelight:beef_stew","tags":["cooking_pot"],"priority":10,"time":100,"ingredients":[{"item":"minecraft:beef"},{"item":"minecraft:carrot"}],"result":{"item":"farmersdelight:beef_stew"},"container":{"item":"minecraft:bowl"}}
```

