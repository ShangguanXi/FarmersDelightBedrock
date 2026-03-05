# **Cooking Recipes**

Cooking recipes are managed through the `cookRecipe` module in the script. These recipes are used for cooking items on **stoves** and **skillets**. After the player places a cookable item on the stove or skillet, it will automatically cook into the product when a heat source is provided.

---

## Recipe Structure

Cooking recipes support two matching methods: **matching by item ID** and **matching by item tag**.

---

## Registering Custom Recipes

Cooking recipes are registered through `ScriptEvent`. Addon mods need to send a script event with ID `farmersdelight:cook`, with the message body in JSON format.

### Message Body Structure

| Field | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| id | string | Yes | | Ingredient item ID or tag (tags start with `#`) |
| result | string | Yes | | Product item ID |
| time | int | No | 200 | Cooking time (ticks) |
| exp | float | No | 0.35 | Experience value |
| count | int | No | | Product quantity |

### Registration by Item ID

```
/scriptevent farmersdelight:cook {"id":"example:raw_meat","result":"example:cooked_meat","time":200,"exp":0.35}
```

### Registration by Item Tag

When `id` starts with `#`, it indicates matching by item tag. All items with that tag will match this recipe:

```
/scriptevent farmersdelight:cook {"id":"#example:is_raw_fish","result":"example:cooked_fish","time":200,"exp":0.35,"count":1}
```

## Applicable Blocks

Cooking recipes apply to the following blocks:

### Stove

- A stove can place up to **6 items** for simultaneous cooking
- The stove must be in a **lit state** to cook
- After cooking is complete, the product will automatically pop out above the stove
- Players can retrieve items from the stove by right-clicking with an empty hand

### Skillet

- A skillet can stack the same type of cookable items
- The skillet requires a **heat source** below to cook
- After cooking is complete, the product will automatically pop out

---

## Particle Effects

During the cooking process, corresponding particle effects will be displayed. The particle name is automatically derived from the item ID:

### Stove Particles

- If the item belongs to the `minecraft` namespace, the particle name is: `farmersdelight:minecraft_stove_<item_name>`
  - Example: `minecraft:beef` → particle `farmersdelight:minecraft_stove_beef`
- If the item belongs to other namespaces, the particle name is: `<namespace>:stove_<item_name>`
  - Example: `farmersdelight:bacon` → particle `farmersdelight:stove_bacon`

**Particle Example**

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

### Skillet Particles

- If the item belongs to the `minecraft` namespace, the particle name is: `farmersdelight:minecraft_skillet_<item_name>`
  - Example: `minecraft:beef` → particle `farmersdelight:minecraft_skillet_beef`
- If the item belongs to other namespaces, the particle name is: `<namespace>:skillet_<item_name>`
  - Example: `farmersdelight:bacon` → particle `farmersdelight:skillet_bacon`
  
  

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
