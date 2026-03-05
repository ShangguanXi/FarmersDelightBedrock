# **农夫乐事基岩版附属开发文档**

## 物品组件

| 组件名称                                                     | 描述                                                         |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| [farmersdelight:consume_effects](#farmersdelightconsume_effects) | 食用效果组件，在物品被食用时为玩家施加指定状态效果           |
| [farmersdelight:farmers_book](#farmersdelightfarmers_book) | 农夫大典组件，使用物品时打开农夫大典界面                     |
| [farmersdelight:increase_production](#farmersdelightincrease_production) | 增产组件，标记物品具有增产效果                               |
| [farmersdelight:knife](#farmersdelightknife)               | 刀组件，提供刀的挖掘掉落和南瓜雕刻功能                       |
| [farmersdelight:seed](#farmersdelightseed)                 | 种子组件，标记物品为种子类型，可与沃土类方块交互，并种植指定作物。 |

---

#### farmersdelight:consume_effects

当物品被消耗时需要给予玩家的状态效果。

###### Type: list

| 参数     | 类型   | 必填 | 说明                                                      |
| -------- | ------ | ---- | --------------------------------------------------------- |
| effect   | string | 是   | 要赋予的效果类型                                          |
| duration | int    | 是   | 效果持续的时间长度（通常单位为刻 tick，20刻=1秒）。       |
| chance   | int    | 否   | 触发该效果的概率，范围是 0.0 到 1.0 (例如 0.5 代表 50%)。 |

**示例：**

json
"farmersdelight:consume_effects": [
  {
     "effect": "regeneration",
     "duration": 200, 
     "amplifier": 0,
     "chance": 1.0
  }
]




#### farmersdelight:farmers_book

当玩家使用物品时，打开农夫大典界面。

###### Type: object

**示例：**

json
"farmersdelight:farmers_book"：{}


---

#### farmersdelight:increase_production

使用含有该组件的物品击杀生物时会根据农夫乐事脚本中的相关逻辑额外掉落物品。

###### Type: object

**示例：**

json
"farmersdelight:increase_production"：{}


> 注：其他附属模组里的增产需要自己实现，建议统一使用该组件来进行判断。

---

#### farmersdelight:knife

对南瓜使用时可雕刻南瓜，或者具有农夫乐事里使用刀具破坏部分方块掉落草杆的功能。

###### Type: object

**示例：**

json
"farmersdelight:knife"：{}


> 注：其他模组里若需要破坏其他方块掉落草杆需要自己实现，建议统一使用该组件来进行判断。

---

#### farmersdelight:seed

种子，可直接种植指定作物到沃土耕地上。

###### Type: string

**示例：**

json
"farmersdelight:seed"："exmaple:crop"


