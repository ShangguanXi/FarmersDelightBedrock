import { system, world } from "@minecraft/server"

export const vanillaCookingPotRecipe = {
    "recipe": [
        {
            "type": "farmersdelight:cooking",
            "cookingtime": 200,
            "experience": 1.0,
            "ingredients": [
                {
                    "item": "minecraft:apple"
                },
                {
                    "item": "minecraft:apple"
                },
                {
                    "item": "minecraft:sugar"
                }
            ],
            "recipe_book_tab": "drinks",
            "result": {
                "item": "farmersdelight:apple_cider"
            }
        },
        {
            "type": "farmersdelight:cooking",
            "container": {
                "item": "minecraft:pumpkin"
            },
            "cookingtime": 200,
            "experience": 2.0,
            "ingredients": [
                /*
                {
                    "tag": "c:crops/rice"
                },
                {
                    "tag": "c:crops/onion"
                },
                */
                {
                    "item": "minecraft:brown_mushroom"
                },
                {
                    "item": "minecraft:potato"
                }
                /*,
                {
                  "tag": "c:berries"
                },
                {
                  "tag": "c:vegetables"
                }
                */
            ],
            "recipe_book_tab": "meals",
            "result": {
                "item": "farmersdelight:stuffed_pumpkin_block_item"
            }
        },
        {
            "type": "farmersdelight:cooking",
            "container": {
                "item": "minecraft:bowl"
            },
            "cookingtime": 200,
            "experience": 1.0,
            "ingredients": [
                {
                    "item": "minecraft:baked_potato"
                },
                {
                    "item": "minecraft:rabbit"
                },
                {
                    "item": "minecraft:carrot"
                },
                [
                    {
                        "item": "minecraft:brown_mushroom"
                    },
                    {
                        "item": "minecraft:red_mushroom"
                    }
                ]
            ],
            "recipe_book_tab": "meals",
            "result": {
                "item": "minecraft:rabbit_stew"
            }
        }
    ]
}

// function init(args) {
//     console.warn(args.message);
//     // const id = args.id;
//     // const string = id.split(':')[1];
//     // try {
//     //     const json = JSON.parse(string);

//     // } catch (error) {
//     //     console.warn('is no Json');
//     // }
// }
// world.beforeEvents.chatSend.subscribe(init);
// system.afterEvents.scriptEventReceive.subscribe(init, { namespaces: ['farmersdelight'] });
