# 方块标签 (Block Tags)

本文档列出了农夫乐事基岩版中使用的所有方块标签。

---

## 方块标签列表

| Tag名称 | 包含的方块 | 作用 |
|---------|-----------|------|
| farmersdelight:cabinet | farmersdelight:oak_cabinet <br/>farmersdelight:spruce_cabinet <br/>farmersdelight:birch_cabinet <br/>farmersdelight:jungle_cabinet <br/>farmersdelight:acacia_cabinet<br/>farmersdelight:dark_oak_cabinet<br/>farmersdelight:mangrove_cabinet<br/>farmersdelight:bamboo_cabinet <br/>farmersdelight:cherry_cabinet <br/>farmersdelight:crimson_cabinet <br/>farmersdelight:warped_cabinet | 标识橱柜 |
| farmersdelight:stove | farmersdelight:stove | 标识炉灶方块 |
| farmersdelight:heat_source | farmersdelight:stove | 标识热源，用于烹饪锅/平底锅检测热源 |
| farmersdelight:blockfood | farmersdelight:shepherds_pie_block <br/>farmersdelight:roast_chicken_block <br/>farmersdelight:honey_glazed_ham_block <br/>farmersdelight:stuffed_pumpkin_block | 标识方块食物 |
| farmersdelight:pie | farmersdelight:apple_pie <br/>farmersdelight:chocolate_pie <br/>farmersdelight:sweet_berry_cheesecake | 标识派类方块 |
| farmersdelight:wild_crop | farmersdelight:wild_tomatoes_block <br/>farmersdelight:wild_potatoes_block <br/>farmersdelight:wild_onions_block <br/>farmersdelight:wild_carrots_block <br/>farmersdelight:wild_cabbages_block <br/>farmersdelight:wild_beetroots_block <br/>farmersdelight:wild_rice_block <br/>farmersdelight:sandy_shrub_block | 标识野生作物 |
| farmersdelight:tatami_mat | farmersdelight:tatami_mat <br/>farmersdelight:tatami_mat_other | 标识榻榻米垫方块 |
| farmersdelight:straw_blocks | farmersdelight:tatami <br/>farmersdelight:tatami_mat <br/>farmersdelight:tatami_mat_other <br/>farmersdelight:half_tatami_mat <br/>farmersdelight:rice_bag <br/>farmersdelight:rice_bale <br/>farmersdelight:straw_bale | 标识稻草类方块，刀具可快速破坏 |
| farmersdelight:mushroom_cluster_habitat | farmersdelight:rich_soil | 标识蘑菇群落可生长的环境 |
| wood | farmersdelight:oak_cabinet <br/>farmersdelight:spruce_cabinet <br/>farmersdelight:birch_cabinet <br/>farmersdelight:jungle_cabinet <br/>farmersdelight:acacia_cabinet <br/>farmersdelight:dark_oak_cabinet <br/>farmersdelight:mangrove_cabinet <br/>farmersdelight:bamboo_cabinet <br/>farmersdelight:cherry_cabinet <br/>farmersdelight:crimson_cabinet<br/>farmersdelight:warped_cabinet<br/>farmersdelight:beetroot_crate <br/>farmersdelight:cabbage_crate <br/>farmersdelight:carrot_crate <br/>farmersdelight:onion_crate <br/>farmersdelight:potato_crate <br/>farmersdelight:tomato_crate | 标识木质方块 |
| dirt | farmersdelight:rich_soil <br/>farmersdelight:rich_soil_farmland | 标识泥土类方块 |
| sand | farmersdelight:rich_soil |  |
| farmland | farmersdelight:rich_soil_farmland | 标识耕地 |
| crop | farmersdelight:tomato_block <br/>farmersdelight:cabbage_block <br/>farmersdelight:onion_block <br/>farmersdelight:rice_block <br/>farmersdelight:rice_upper <br/>farmersdelight:brown_mushroom_colony <br/>farmersdelight:red_mushroom_colony <br/>farmersdelight:rich_soil_wheat <br/>farmersdelight:rich_soil_carrot <br/>farmersdelight:rich_soil_potato <br/>farmersdelight:rich_soil_beetroot <br/>farmersdelight:rich_soil_torchflower_crop<br/>farmersdelight:rich_soil_sugar_cane_bottom<br/>farmersdelight:rich_soil_sugar_cane_middle<br/> farmersdelight:rich_soil_sugar_cane_top | 标识作物方块 |
| compost_activators | farmersdelight:rich_soil<br/>farmersdelight:brown_mushroom_colony<br/>farmersdelight:red_mushroom_colony | 标识可加速有机肥料转换 |
| mushroom_grow_block | farmersdelight:rich_soil <br/>farmersdelight:organic_compost | 标识蘑菇可生长的方块 |

---

## 在脚本中检测方块Tag

```javascript
// 检测方块是否有某个Tag
if (block.hasTag("farmersdelight:cabinet")) {
    // 执行橱柜相关逻辑
}

// 获取方块所有Tags
const tags = block.getTags();
```

