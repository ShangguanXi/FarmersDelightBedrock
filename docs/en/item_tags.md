# Item Tags

This document lists all item tags used in Farmer's Delight Bedrock Edition.

---

## Item Tag List

| Tag Name | Included Items | Purpose |
|----------|----------------|---------|
| farmersdelight:is_knife | farmersdelight:flint_knife<br> farmersdelight:iron_knife<br> farmersdelight:golden_knife<br> farmersdelight:diamond_knife<br> farmersdelight:netherite_knife | Identifies knives, used for cutting, harvesting straw, and other logic checks |
| farmersdelight:straw_harvesters | farmersdelight:flint_knife<br> farmersdelight:iron_knife<br> farmersdelight:golden_knife<br> farmersdelight:diamond_knife<br> farmersdelight:netherite_knife | Allows harvesting hay/straw |
| farmersdelight:is_raw_fish | farmersdelight:salmon_slice<br> farmersdelight:cod_slice | Identifies raw fish |
| farmersdelight:is_raw_porkchop | farmersdelight:bacon | Identifies raw porkchop ingredients |
| farmersdelight:is_porkchop | farmersdelight:bacon<br> farmersdelight:cooked_bacon | Identifies porkchop ingredients (raw/cooked) |
| farmersdelight:is_raw_mutton | farmersdelight:mutton_chops | Identifies raw mutton |
| farmersdelight:is_raw_chicken | farmersdelight:chicken_cuts | Identifies raw chicken |
| farmersdelight:is_raw_beef | farmersdelight:minced_beef | Identifies raw beef |
| farmersdelight:is_cooked_fish | farmersdelight:cooked_salmon_slice<br> farmersdelight:cooked_cod_slice | Identifies cooked fish |
| farmersdelight:is_cooked_salmon | farmersdelight:cooked_salmon_slice | Identifies cooked salmon |
| farmersdelight:is_cooked_cod | farmersdelight:cooked_cod_slice | Identifies cooked cod |
| farmersdelight:is_cooked_porkchop | farmersdelight:cooked_bacon | Identifies cooked porkchop |
| farmersdelight:is_cooked_mutton | farmersdelight:cooked_mutton_chops | Identifies cooked mutton |
| farmersdelight:is_cooked_chicken | farmersdelight:cooked_chicken_cuts | Identifies cooked chicken |
| farmersdelight:is_cooked_beef | farmersdelight:beef_patty | Identifies cooked beef |
| farmersdelight:is_cooked_egg | farmersdelight:fried_egg | Identifies cooked egg |
| farmersdelight:cabbage_roll_ingredients | farmersdelight:salmon_slice<br> farmersdelight:minced_beef<br> farmersdelight:bacon<br> farmersdelight:chicken_cuts<br> farmersdelight:cod_slice | Ingredients that can be used to make cabbage rolls |
| farmersdelight:wolf_prey | farmersdelight:mutton_chops<br> farmersdelight:chicken_cuts | Ingredients for making wolf food |
| farmersdelight:is_cabbage | farmersdelight:cabbage<br> farmersdelight:cabbage_leaf | Identifies cabbage ingredients |
| farmersdelight:is_tomato | farmersdelight:tomato | Identifies tomato |
| farmersdelight:is_onion | farmersdelight:onion | Identifies onion |
| farmersdelight:is_rice | farmersdelight:rice | Identifies rice |
| farmersdelight:is_milk | farmersdelight:milk_bottle | Identifies milk |
| farmersdelight:is_pasta | farmersdelight:raw_pasta | Identifies pasta |
| farmersdelight:is_dough | farmersdelight:wheat_dough | Identifies dough |

---

## Using Tags in Recipes

In recipe JSON files, you can use the tag field to match items with specific tags:

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

This way, any item with the farmersdelight:is_onion tag can be used in this recipe.

---

## Detecting Item Tags in Scripts

```javascript
// Check if an item has a specific tag
if (itemStack.hasTag("farmersdelight:is_knife")) {
    // Execute knife-related logic
}
```
