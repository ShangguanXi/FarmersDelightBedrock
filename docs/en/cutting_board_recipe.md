# **Cutting Board Recipes**

Cutting board recipes are managed through the `CuttingBoardRecipeManager` in the script. After the player places an item on the cutting board, they can cut it by right-clicking with the corresponding tool.

---

## Recipe Structure

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| ingredients | object | Yes | Input material, see [ingredients](#ingredients) |
| result | array | Yes | Output product list, see [result](#result) |
| tool | object | Yes | Required tool, see [tool](#tool) |
| is_block_type | boolean | No | Whether the input material is a block type (default `false`), when set to `true` the material will be displayed as a block model on the cutting board |
| sound | string | Yes | Sound effect ID played when cutting |

---

### ingredients

Input material.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| item | string | Yes | Input item ID |

**Example:**

```json
"ingredients": { "item": "minecraft:pumpkin" }
```

---

### result

Output product list. Each recipe can have multiple products.

| Field | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| item | string | Yes | | Output item ID |
| count | int | No | 1 | Output quantity |
| chance | float | No | 1.0 | Drop probability, range 0.0 ~ 1.0 |

**Example:**

```json
"result": [
    { "item": "farmersdelight:tomato_seeds", "count": 1 },
    { "item": "farmersdelight:tomato", "count": 1, "chance": 0.2 }
]
```

> Note: When `chance` is less than 1.0, the product may not drop.

---

### tool

The tool required for cutting, can be matched by item ID or item tag.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| item | string | No | Tool item ID (choose one of `item` or `tag`) |
| tag | string | No | Tool item tag (choose one of `tag` or `item`) |

**Example:**

```json
"tool": { "tag": "farmersdelight:is_knife" }
```

```json
"tool": { "tag": "minecraft:is_axe" }
```

---

## Complete Recipe Examples

### Basic Cutting (Knife Cuts Flower to Get Dye)

```json
{
    "ingredients": { "item": "minecraft:poppy" },
    "result": [{ "item": "minecraft:red_dye", "count": 2 }],
    "tool": { "tag": "farmersdelight:is_knife" },
    "is_block_type": false,
    "sound": "use.wood"
}
```

### Cutting with Probability Drop

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

### Block Type Cutting (Cutting Pumpkin)

```json
{
    "ingredients": { "item": "minecraft:pumpkin" },
    "result": [{ "item": "farmersdelight:pumpkin_slice", "count": 4 }],
    "tool": { "tag": "farmersdelight:is_knife" },
    "is_block_type": true,
    "sound": "use.wood"
}
```

### Axe Stripping Bark (Multiple Products)

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

## Registering Custom Recipes

Cutting board recipes are registered through `ScriptEvent`. Addon mods need to send a script event with ID `farmersdelight:cutting_board_recipe`, with the message body in JSON format.

### Message Body Structure

| Field | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| ingredients | object / array | Yes | | Input material, same format as [ingredients](#ingredients) |
| tool | object | Yes | | Required tool, same format as [tool](#tool), must contain `tag` or `item` |
| result | array | Yes | | Output product list, same format as [result](#result), cannot be empty |
| is_block_type | boolean | No | false | Whether the input material is a block type |
| sound | string | No | `"use.wood"` | Sound effect ID played when cutting |
| exp | number | No | | Experience gained from cutting |

### Example Commands

**Basic Registration:**

```
/scriptevent farmersdelight:cutting_board_recipe {"ingredients":{"item":"example:my_item"},"result":[{"item":"example:my_output","count":2}],"tool":{"tag":"farmersdelight:is_knife"},"sound":"use.wood"}
```

**Block Type Cutting:**

```
/scriptevent farmersdelight:cutting_board_recipe {"ingredients":{"item":"example:my_block"},"result":[{"item":"example:my_slice","count":4}],"tool":{"tag":"minecraft:is_axe"},"is_block_type":true,"sound":"use.wood"}
```

**With Probability Drop:**

```
/scriptevent farmersdelight:cutting_board_recipe {"ingredients":{"item":"example:my_crop"},"result":[{"item":"example:seed","count":1},{"item":"example:extra","count":1,"chance":0.5}],"tool":{"tag":"farmersdelight:is_knife"},"sound":"use.wood"}
```

### Scoreboard Batch Registration Mechanism

The recipe registration system will automatically detect all scoreboards with names (`displayName`) matching `farmersdelight_<name>` when the world loads, and execute the corresponding function file at the path:

```
functions/farmersdelight/cutting_board_recipe_registries/<name>.mcfunction
```

Addon mods can use this mechanism to batch register cutting board recipes through scriptevent commands in the function file:

1. Create a scoreboard with `displayName` as `farmersdelight_<your_mod_name>`
2. Create a function file in the behavior pack at `functions/farmersdelight/cutting_board_recipe_registries/<your_mod_name>.mcfunction`
3. Write registration commands in the function file:

```mcfunction
scriptevent farmersdelight:cutting_board_recipe {"ingredients":{"item":"example:item_a"},"result":[{"item":"example:output_a","count":2}],"tool":{"tag":"farmersdelight:is_knife"},"sound":"use.wood"}
scriptevent farmersdelight:cutting_board_recipe {"ingredients":{"item":"example:item_b"},"result":[{"item":"example:output_b","count":1}],"tool":{"tag":"minecraft:is_axe"},"is_block_type":true,"sound":"use.wood"}
```

> After the world loads, the system will automatically execute the function file to complete all recipe registrations.

---

## Particle Effects

After placing an item on the cutting board, corresponding particle effects will be displayed. The particle name is automatically derived from the item ID:

- If the item belongs to the `minecraft` namespace, the particle name is: `farmersdelight:minecraft_<item_name>`
  - Example: `minecraft:beef` → particle `farmersdelight:minecraft_beef`
