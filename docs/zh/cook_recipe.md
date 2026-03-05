# **烧制配方**

烧制配方通过脚本中的 `cookRecipe` 模块进行管理。该配方用于**炉灶**和**平底锅**上的物品烧制，玩家将可烧制的物品放置在炉灶或平底锅上后，在提供热源的情况下自动烧制为产物。

---

## 配方结构

烧制配方支持两种匹配方式：**按物品 ID 匹配**和**按物品标签匹配**。

---

## 注册自定义配方

烧制配方通过 `ScriptEvent`（脚本事件）进行注册。附属模组需要发送 ID 为 `farmersdelight:cook` 的脚本事件，消息体为 JSON 格式。

### 消息体结构

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| id | string | 是 | | 原料物品 ID 或标签（标签以 `#` 开头） |
| result | string | 是 | | 产物物品 ID |
| time | int | 否 | 200 | 烧制时间（tick） |
| exp | float | 否 | 0.35 | 经验值 |
| count | int | 否 | | 产物数量 |

### 按物品 ID 注册

```
/scriptevent farmersdelight:cook {"id":"example:raw_meat","result":"example:cooked_meat","time":200,"exp":0.35}
```

### 按物品标签注册

当 `id` 以 `#` 开头时，表示使用物品标签匹配。拥有该标签的所有物品都会匹配此配方：

```
/scriptevent farmersdelight:cook {"id":"#example:is_raw_fish","result":"example:cooked_fish","time":200,"exp":0.35,"count":1}
```

## 适用方块

烧制配方适用于以下方块：

### 炉灶（Stove）

- 炉灶上最多可放置 **6 个**物品同时烧制
- 炉灶需处于**点燃状态**才能烧制
- 烧制完成后产物会自动弹出到炉灶上方
- 玩家空手右键可以取回炉灶上的物品

### 煎锅（Skillet）

- 煎锅可以堆叠放置同种可烧制物品
- 煎锅需要下方有**热源**才能烧制
- 烧制完成后产物会自动弹出

---

## 粒子效果

烧制过程中会显示对应的粒子效果。粒子名称由物品 ID 自动推导：

### 炉灶粒子

- 若物品属于 `minecraft` 命名空间，粒子名称为：`farmersdelight:minecraft_stove_<物品名>`
  - 例：`minecraft:beef` → 粒子 `farmersdelight:minecraft_stove_beef`
- 若物品属于其他命名空间，粒子名称为：`<命名空间>:stove_<物品名>`
  - 例：`farmersdelight:bacon` → 粒子 `farmersdelight:stove_bacon`

**粒子示例**

```json
{
  "format_version": "1.10.0", 
  "particle_effect": {
     "description": { 
       "identifier": "farmersdelight:stove_chicken_cuts",
       "basic_render_parameters": {
         "material": "particles_alpha", 
         "texture": "textures/items/chicken_cuts"
       }
     }, 
     "components": {
       "minecraft:emitter_lifetime_once": {
         "active_time": 0.12
       },
       "minecraft:emitter_rate_steady": {
         "max_particles": 60, 
         "spawn_rate": 1250
       }, 
       "minecraft:emitter_shape_box": {
         "direction": "outwards", 
         "half_dimensions": [ 0, 0.009375, 0 ], 
         "offset": [ 0, 0.009375, 0 ]
       }, 
       "minecraft:particle_appearance_billboard": {
         "facing_camera_mode": "emitter_transform_xz", 
         "size": [  0.15,  0.15 ], 
         "uv": {
           "texture_height": 16, 
           "texture_width": 16, 
           "uv": [ 0, 0 ], 
           "uv_size": [ 16, 16 ]
         }
       }, 
       "minecraft:particle_initial_speed": 0, 
       "minecraft:particle_lifetime_expression": {
         "max_lifetime": 0.05
       }, 
       "minecraft:particle_motion_dynamic": {},
       "minecraft:particle_appearance_lighting": {}
     }
  }
}
```

### 煎锅粒子

- 若物品属于 `minecraft` 命名空间，粒子名称为：`farmersdelight:minecraft_skillet_<物品名>`
  - 例：`minecraft:beef` → 粒子 `farmersdelight:minecraft_skillet_beef`
- 若物品属于其他命名空间，粒子名称为：`<命名空间>:skillet_<物品名>`
  - 例：`farmersdelight:bacon` → 粒子 `farmersdelight:skillet_bacon`
  
  

```json
{
  "format_version": "1.10.0", 
  "particle_effect": {
     "description": { 
       "identifier": "farmersdelight:skillet_chicken_cuts",
       "basic_render_parameters": {
         "material": "particles_alpha", 
         "texture": "textures/items/chicken_cuts"
       }
     }, 
     "components": {
       "minecraft:emitter_lifetime_once": {
         "active_time": 0.12
       },
       "minecraft:emitter_rate_steady": {
          "max_particles": 60, 
          "spawn_rate": 1250
       }, 
        "minecraft:emitter_shape_box": {
		  "offset": [0, 0.01563, 0],
		  "half_dimensions": [0, 0.01563, 0],
		  "direction": "outwards"
		},
       "minecraft:particle_appearance_billboard": {
         "facing_camera_mode": "emitter_transform_xz", 
         "size": [  0.25,  0.25 ], 
         "uv": {
           "texture_height": 16, 
           "texture_width": 16, 
           "uv": [ 0, 0 ], 
           "uv_size": [ 16, 16 ]
         }
       }, 
       "minecraft:particle_initial_speed": 0, 
       "minecraft:particle_lifetime_expression": {
         "max_lifetime": 0.05
       }, 
       "minecraft:particle_motion_dynamic": {},
       "minecraft:particle_appearance_lighting": {}
     }
  }
}
```

