# **Farmer's Delight Bedrock Edition Addon Development Documentation**

## Item Components

| Component Name                                               | Description                                                  |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| [farmersdelight:consume_effects](#farmersdelightconsume_effects) | Consume effects component, applies specified status effects to the player when the item is consumed |
| [farmersdelight:farmers_book](#farmersdelightfarmers_book) | Farmer's Almanac component, opens the Farmer's Almanac interface when the item is used |
| [farmersdelight:increase_production](#farmersdelightincrease_production) | Increase production component, marks the item as having increased production effect |
| [farmersdelight:knife](#farmersdelightknife)               | Knife component, provides knife mining drops and pumpkin carving functionality |
| [farmersdelight:seed](#farmersdelightseed)                 | Seed component, marks the item as a seed type that can interact with rich soil blocks and plant specified crops |

---

#### farmersdelight:consume_effects

Status effects to be given to the player when the item is consumed.

###### Type: list

| Parameter | Type   | Required | Description                                                      |
| --------- | ------ | -------- | ---------------------------------------------------------------- |
| effect    | string | Yes      | The type of effect to apply                                      |
| duration  | int    | Yes      | Duration of the effect (typically in ticks, 20 ticks = 1 second) |
| chance    | int    | No       | Probability of triggering the effect, range is 0.0 to 1.0 (e.g., 0.5 represents 50%) |

**Example:**

```json
"farmersdelight:consume_effects": [
  {
     "effect": "regeneration",
     "duration": 200, 
     "amplifier": 0,
     "chance": 1.0
  }
]
```


#### farmersdelight:farmers_book

Opens the Farmer's Almanac interface when the player uses the item.

###### Type: object

**Example:**

```json
"farmersdelight:farmers_book": {}
```

---

#### farmersdelight:increase_production

When killing mobs with items containing this component, additional items will be dropped according to the related logic in Farmer's Delight scripts.

###### Type: object

**Example:**

```json
"farmersdelight:increase_production": {}
```

> Note: Increased production in other addon mods needs to be implemented by yourself. It is recommended to use this component uniformly for judgment.

---

#### farmersdelight:knife

Can carve pumpkins when used on them, or has the functionality to drop straw when breaking certain blocks with knives in Farmer's Delight.

###### Type: object

**Example:**

```json
"farmersdelight:knife": {}
```

> Note: If other mods need to drop straw when breaking other blocks, it needs to be implemented by yourself. It is recommended to use this component uniformly for judgment.

---

#### farmersdelight:seed

Seed, can directly plant specified crops on rich soil farmland.

###### Type: string

**Example:**

```json
"farmersdelight:seed": "example:crop"
```
