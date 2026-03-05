# Block Custom Components

| Component Name | Description |
| --- | --- |
| [farmersdelight:block_entity](#farmersdelightblock_entity) | Block entity component, used to initialize the name tag of container blocks |
| [farmersdelight:cabinet](#farmersdelightcabinet) | Cabinet component, defines the block as a cabinet |
| [farmersdelight:crop](#farmersdelightcrop) | Crop component, handles normal crop growth, bone meal fertilization, and harvesting |
| [farmersdelight:dish](#farmersdelightdish) | Dish component, used to handle block food interactions |
| [farmersdelight:interact](#farmersdelightinteract) | Interact component, triggers general interaction event listeners |
| [farmersdelight:mushroom_cluster](#farmersdelightmushroom_cluster) | Mushroom cluster component, handles mushroom cluster growth and bone meal fertilization |
| [farmersdelight:pastry](#farmersdelightpastry) | Pastry component, handles slicing and eating of cake-type blocks |
| [farmersdelight:stove](#farmersdelightstove) | Stove component, handles stove ignition, extinguishing, and cooking logic |

---

## Detailed Description

### farmersdelight:block_entity

Block entity component. Initializes the name tag of the block entity when the block is placed.

###### Type: string

**Example:**

```json
"farmersdelight:block_entity": "example:block_entity"
```

---

### farmersdelight:crop

Crop component. Used to handle normal crop growth, bone meal fertilization, and right-click harvesting logic.

###### Type: object

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| loot | string | Yes | Loot table path |
| state | object, see below | Yes | Crop state definition (growth stage property name, max age, age after harvest) |

state field:

| Field              | Type   | Required | Default | Description                |
| ----------------- | ------ | -------- | ------- | -------------------------- |
| name              | string | Yes      |         | Growth state name          |
| age               | int    | Yes      |         | Maximum growth stage       |
| age_after_harvest | int    | No       | 0       | Growth state after right-click harvest |

**Example:**

```json
"farmersdelight:crop": {
    "loot": "loot_tables/farmersdelight/crops/farmersdelight_onion_riped.json",
    "state": {
        "name": "farmersdelight:growth",
        "age": 7
    }
}
```

---

### farmersdelight:dish

Dish component. Used to handle placed block food.

###### Type: object

| Field | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| servings | int | No | 1 | Total servings |
| contents | string \| string[] | Yes |  | Item ID obtained after use; value can be in array form to return multiple items |
| utensil | string | No |  | Item ID of the utensil required for use; when starting with #, it is recognized as an item tag. If this field is not filled, all items (including empty hand) can interact with it by default |
| has_leftovers | boolean | No | false | Whether to keep the remainder after use (such as an empty plate) |

**Example:**

```json
"farmersdelight:dish": {
    "has_leftovers": true,
    "servings": 4,
    "contents": "farmersdelight:honey_glazed_ham",
    "utensil": "minecraft:bowl"
}
```

> Each use increases the farmersdelight:food_block_stage state, so if using this component, this block food needs to use the farmersdelight:food_block_stage state.

---

### farmersdelight:interact

Interact component. Can trigger use-related event listeners.

###### Type: object

**Example:**

```json
"farmersdelight:interact": {}
```

---

### farmersdelight:mushroom_cluster

Mushroom cluster component. Handles natural growth and bone meal fertilization of mushroom clusters. Only allowed to be placed on blocks like mycelium, podzol, etc.

###### Type: object

| Field | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| maturity | int | No | 4 | Maturity stage value |
| mushroom | string | Yes |  | Item ID of the mushroom cut with shears |
| mushtree | string | No |  | Structure name of the giant mushroom that may grow when bone meal is used at the first stage |
| offset | vector3 | No |  | Structure generation offset. If mushtree is not empty, this field is required |

> Note: The name of the block state corresponding to the growth state should be farmersdelight:growth.

---

### farmersdelight:pastry

Pastry component. Handles slicing and eating of cake-type blocks (such as apple pie). Right-click with a knife to cut off a portion of pastry item. Right-click directly to eat a portion, restoring saturation and gaining speed effect. Breaking the block with a knife drops all remaining slices.

###### Type: object

| Field | Type | Description |
| --- | --- | --- |
| slice | string | Slice item ID |
| counter | string | Block state key name that records remaining servings |
| servings | number | Total servings |
| seals | number | Initial appearance offset (for certain models) |

---

### farmersdelight:stove

Stove component. Both a block entity and an interactive block.

###### Type: string

**Example:**

```json
"farmersdelight:stove": "farmersdelight:stove"
```

> Note: The value should be consistent with the block ID, and the block state name indicating whether it is lit should be farmersdelight:stove.
