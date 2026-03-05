# Block Tags

This document lists all block tags used in Farmer's Delight Bedrock Edition.

---

## Block Tag List

| Tag Name | Included Blocks | Purpose |
|----------|-----------------|---------|
| farmersdelight:cabinet | farmersdelight:oak_cabinet <br/>farmersdelight:spruce_cabinet <br/>farmersdelight:birch_cabinet <br/>farmersdelight:jungle_cabinet <br/>farmersdelight:acacia_cabinet<br/>farmersdelight:dark_oak_cabinet<br/>farmersdelight:mangrove_cabinet<br/>farmersdelight:bamboo_cabinet <br/>farmersdelight:cherry_cabinet <br/>farmersdelight:crimson_cabinet <br/>farmersdelight:warped_cabinet | Identifies cabinets |
| farmersdelight:stove | farmersdelight:stove | Identifies stove blocks |
| farmersdelight:heat_source | farmersdelight:stove | Identifies heat sources, used for cooking pot/skillet heat source detection |
| farmersdelight:blockfood | farmersdelight:shepherds_pie_block <br/>farmersdelight:roast_chicken_block <br/>farmersdelight:honey_glazed_ham_block <br/>farmersdelight:stuffed_pumpkin_block | Identifies block foods |
| farmersdelight:pie | farmersdelight:apple_pie <br/>farmersdelight:chocolate_pie <br/>farmersdelight:sweet_berry_cheesecake | Identifies pie blocks |
| farmersdelight:wild_crop | farmersdelight:wild_tomatoes_block <br/>farmersdelight:wild_potatoes_block <br/>farmersdelight:wild_onions_block <br/>farmersdelight:wild_carrots_block <br/>farmersdelight:wild_cabbages_block <br/>farmersdelight:wild_beetroots_block <br/>farmersdelight:wild_rice_block <br/>farmersdelight:sandy_shrub_block | Identifies wild crops |
| farmersdelight:tatami_mat | farmersdelight:tatami_mat <br/>farmersdelight:tatami_mat_other | Identifies tatami mat blocks |
| farmersdelight:straw_blocks | farmersdelight:tatami <br/>farmersdelight:tatami_mat <br/>farmersdelight:tatami_mat_other <br/>farmersdelight:half_tatami_mat <br/>farmersdelight:rice_bag <br/>farmersdelight:rice_bale <br/>farmersdelight:straw_bale | Identifies straw blocks, can be quickly broken by knives |
| farmersdelight:mushroom_cluster_habitat | farmersdelight:rich_soil | Identifies environment where mushroom clusters can grow |
| wood | farmersdelight:oak_cabinet <br/>farmersdelight:spruce_cabinet <br/>farmersdelight:birch_cabinet <br/>farmersdelight:jungle_cabinet <br/>farmersdelight:acacia_cabinet <br/>farmersdelight:dark_oak_cabinet <br/>farmersdelight:mangrove_cabinet <br/>farmersdelight:bamboo_cabinet <br/>farmersdelight:cherry_cabinet <br/>farmersdelight:crimson_cabinet<br/>farmersdelight:warped_cabinet<br/>farmersdelight:beetroot_crate <br/>farmersdelight:cabbage_crate <br/>farmersdelight:carrot_crate <br/>farmersdelight:onion_crate <br/>farmersdelight:potato_crate <br/>farmersdelight:tomato_crate | Identifies wooden blocks |
| dirt | farmersdelight:rich_soil <br/>farmersdelight:rich_soil_farmland | Identifies dirt blocks |
| sand | farmersdelight:rich_soil |  |
| farmland | farmersdelight:rich_soil_farmland | Identifies farmland |
| crop | farmersdelight:tomato_block <br/>farmersdelight:cabbage_block <br/>farmersdelight:onion_block <br/>farmersdelight:rice_block <br/>farmersdelight:rice_upper <br/>farmersdelight:brown_mushroom_colony <br/>farmersdelight:red_mushroom_colony <br/>farmersdelight:rich_soil_wheat <br/>farmersdelight:rich_soil_carrot <br/>farmersdelight:rich_soil_potato <br/>farmersdelight:rich_soil_beetroot <br/>farmersdelight:rich_soil_torchflower_crop<br/>farmersdelight:rich_soil_sugar_cane_bottom<br/>farmersdelight:rich_soil_sugar_cane_middle<br/> farmersdelight:rich_soil_sugar_cane_top | Identifies crop blocks |
| compost_activators | farmersdelight:rich_soil<br/>farmersdelight:brown_mushroom_colony<br/>farmersdelight:red_mushroom_colony | Identifies blocks that can accelerate organic compost conversion |
| mushroom_grow_block | farmersdelight:rich_soil <br/>farmersdelight:organic_compost | Identifies blocks where mushrooms can grow |

---

## Detecting Block Tags in Scripts

```javascript
// Check if a block has a specific tag
if (block.hasTag("farmersdelight:cabinet")) {
    // Execute cabinet-related logic
}

// Get all tags of a block
const tags = block.getTags();
```
