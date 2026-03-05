# 物品标签 (Item Tags)

本文档列出了农夫乐事基岩版中使用的所有物品标签。

---

## 物品标签列表

| Tag名称 | 包含的物品 | 作用 |
|---------|-----------|------|
| farmersdelight:is_knife | farmersdelight:flint_knife<br> farmersdelight:iron_knife<br> farmersdelight:golden_knife<br> farmersdelight:diamond_knife<br> farmersdelight:netherite_knife | 标识刀具，用于切菜、收割稻草等逻辑判断 |
| farmersdelight:straw_harvesters | farmersdelight:flint_knife<br> farmersdelight:iron_knife<br> farmersdelight:golden_knife<br> farmersdelight:diamond_knife<br> farmersdelight:netherite_knife | 允许收割干草/稻草 |
| farmersdelight:is_raw_fish | farmersdelight:salmon_slice<br> farmersdelight:cod_slice | 标识生鱼 |
| farmersdelight:is_raw_porkchop | farmersdelight:bacon | 标识生猪排类食材 |
| farmersdelight:is_porkchop | farmersdelight:bacon<br> farmersdelight:cooked_bacon | 标识猪排类食材（生/熟） |
| farmersdelight:is_raw_mutton | farmersdelight:mutton_chops | 标识生羊肉 |
| farmersdelight:is_raw_chicken | farmersdelight:chicken_cuts | 标识生鸡肉 |
| farmersdelight:is_raw_beef | farmersdelight:minced_beef | 标识生牛肉 |
| farmersdelight:is_cooked_fish | farmersdelight:cooked_salmon_slice<br> farmersdelight:cooked_cod_slice | 标识熟鱼 |
| farmersdelight:is_cooked_salmon | farmersdelight:cooked_salmon_slice | 标识熟鲑鱼 |
| farmersdelight:is_cooked_cod | farmersdelight:cooked_cod_slice | 标识熟鳕鱼 |
| farmersdelight:is_cooked_porkchop | farmersdelight:cooked_bacon | 标识熟猪排 |
| farmersdelight:is_cooked_mutton | farmersdelight:cooked_mutton_chops | 标识熟羊肉 |
| farmersdelight:is_cooked_chicken | farmersdelight:cooked_chicken_cuts | 标识熟鸡肉 |
| farmersdelight:is_cooked_beef | farmersdelight:beef_patty | 标识熟牛肉 |
| farmersdelight:is_cooked_egg | farmersdelight:fried_egg | 标识熟蛋 |
| farmersdelight:cabbage_roll_ingredients | farmersdelight:salmon_slice<br> farmersdelight:minced_beef<br> farmersdelight:bacon<br> farmersdelight:chicken_cuts<br> farmersdelight:cod_slice | 可用于制作卷心菜卷的原料 |
| farmersdelight:wolf_prey | farmersdelight:mutton_chops<br> farmersdelight:chicken_cuts | 制作狼食的材料 |
| farmersdelight:is_cabbage | farmersdelight:cabbage<br> farmersdelight:cabbage_leaf | 标识卷心菜类食材 |
| farmersdelight:is_tomato | farmersdelight:tomato | 标识番茄 |
| farmersdelight:is_onion | farmersdelight:onion | 标识洋葱 |
| farmersdelight:is_rice | farmersdelight:rice | 标识稻米 |
| farmersdelight:is_milk | farmersdelight:milk_bottle | 标识牛奶 |
| farmersdelight:is_pasta | farmersdelight:raw_pasta | 标识意大利面 |
| farmersdelight:is_dough | farmersdelight:wheat_dough | 标识面团 |

---

## 在配方中使用Tag

在配方JSON中，可以使用tag字段来匹配具有特定标签的物品：

```json
{
    "format_version": "1.12",
    "minecraft:recipe_shapeless": {
        "description": {
            "identifier": "farmersdelight:mutton_wrap_tag"
        },
        "tags": ["crafting_table"],
        "ingredients": [
            { "item": "minecraft:bread" },
            { "tag": "farmersdelight:is_onion" },
            { "tag": "farmersdelight:is_cabbage" },
            { "tag": "farmersdelight:is_cooked_mutton" }
        ],
        "result": {
            "item": "farmersdelight:mutton_wrap"
        }
    }
}
```


这样任何具有farmersdelight:is_onion标签的物品都可以用于这个配方。

---

## 在脚本中检测物品Tag

```javascript
// 检测物品是否有某个Tag
if (itemStack.hasTag("farmersdelight:is_knife")) {
    // 执行刀具相关逻辑
}
```

