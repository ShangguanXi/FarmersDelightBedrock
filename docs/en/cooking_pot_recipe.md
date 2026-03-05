# **Cooking Pot Recipes**

Cooking pot recipes are managed through `CookingPotRecipe` (inherited from `RecipeHolder`) in the script. After the player puts ingredients into the cooking pot, it will automatically cook when a heat source is provided below.

---

## Recipe Structure

| Field | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| identifer | string | Yes | | Recipe unique identifier, format is `namespace:recipe_name` |
| tags | string[] | Yes | | Recipe tag list, cooking pot recipes need to include `"cooking_pot"` |
| priority | int | No | 0 | Priority, higher value means higher priority. Recipes with the same identifier will keep the version with higher priority |
| time | int | Yes | | Cooking time required (in ticks, 20 ticks = 1 second) |
| experience | float | No | 0 | Experience gained from cooking |
| ingredients | array | Yes | | Input ingredient list (up to 6), see [ingredients](#ingredients) |
| result | object | Yes | | Output product, see [result](#result) |
| container | object | No | | Container item required to take out the product, see [container](#container) |
| recipe_book_tab | string | No | | Category tab in the recipe book (such as `"meals"`, `"drinks"`, `"misc"`), currently not used |

---

### ingredients

Input ingredient list. Each element can be a single ingredient or an array representing "one of multiple".

#### Single Ingredient

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| item | string | No | Item ID (choose one of `item` or `tag`) |
| tag | string | No | Item tag (choose one of `tag` or `item`) |

#### One of Multiple Ingredients

When an ingredient slot can accept multiple items, use array form:

```json
[
    { "item": "minecraft:porkchop" },
    { "item": "minecraft:beef" },
    { "tag": "farmersdelight:is_raw_porkchop" }
]
```

> Any item/tag in the array can satisfy the requirement for that slot.

**Example:**

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

Output product.

| Field | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| item | string | Yes | | Output item ID |
| count | int | No | 1 | Output quantity (corresponds to `amount` field) |

**Example:**

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

The container item needed when taking out the product. If the recipe defines a `container`, the player needs to hold the container item to take out the product from the cooking pot.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| item | string | Yes | Container item ID |

**Example:**

```json
"container": {
    "item": "minecraft:bowl"
}
```

> If the recipe does not contain the `container` field, the product can be taken out directly.

---

## Complete Recipe Examples

### Basic Recipe (with Container)

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

### One of Multiple Ingredients Recipe

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

### Multiple Output Quantity Recipe

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

## Registering Custom Recipes

Cooking pot recipes are registered through `ScriptEvent`. Addon mods need to send a script event with ID `farmersdelight:cooking_pot_recipe`, with the message body being the complete recipe JSON.

### Message Body Structure

The message body is the complete [Recipe Structure](#recipe-structure), where `time`, `ingredients`, `result` are required fields (`result` must contain the `item` field, `ingredients` cannot be an empty array).

### Example Commands

**Basic Recipe (with Container):**

```
/scriptevent farmersdelight:cooking_pot_recipe {"identifer":"example:my_stew","tags":["cooking_pot"],"time":200,"experience":1.0,"container":{"item":"minecraft:bowl"},"ingredients":[{"item":"example:ingredient_a"},{"item":"example:ingredient_b"}],"result":{"item":"example:my_stew"}}
```

**One of Multiple Ingredients Recipe:**

```
/scriptevent farmersdelight:cooking_pot_recipe {"identifer":"example:my_soup","tags":["cooking_pot"],"time":200,"ingredients":[[{"item":"minecraft:beef"},{"item":"minecraft:porkchop"}],{"item":"minecraft:carrot"}],"result":{"item":"example:my_soup"},"container":{"item":"minecraft:bowl"}}
```

**Override Original Recipe (High Priority):**

```
/scriptevent farmersdelight:cooking_pot_recipe {"identifer":"farmersdelight:beef_stew","tags":["cooking_pot"],"priority":10,"time":100,"ingredients":[{"item":"minecraft:beef"},{"item":"minecraft:carrot"}],"result":{"item":"farmersdelight:beef_stew"},"container":{"item":"minecraft:bowl"}}
```
