import { system, world } from "@minecraft/server"

export const vanillaCookingPotRecipe = {
    "recipe": [
        {
            "type": "farmersdelight:cooking",
            "cookingtime": 200,
            "experience": 1.0,
            "container": {
                "item": "minecraft:glass_bottle"
            },
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
            "cookingtime": 200,
            "experience": 1.0,
            "container": {
                "item": "minecraft:glass_bottle"
            },
            "ingredients": [
                {
                    "item": "minecraft:cocoa_beans"
                },
                {
                    "item": "minecraft:cocoa_beans"
                },
                {
                    "item": "minecraft:sugar"
                },
                {
                    "tag": "minecraft:milk_bucket"
                }
            ],
            "recipe_book_tab": "drinks",
            "result": {
                "item": "farmersdelight:hot_cocoa"
            }
        },
        {
            "type": "farmersdelight:cooking",
            "cookingtime": 200,
            "experience": 1.0,
            "container": {
                "item": "minecraft:glass_bottle"
            },
            "ingredients": [
                {
                    "item": "minecraft:cocoa_beans"
                },
                {
                    "item": "minecraft:cocoa_beans"
                },
                {
                    "item": "minecraft:sugar"
                },
                {
                    "tag": "minecraft:is_milk_bottle"
                }
            ],
            "recipe_book_tab": "drinks",
            "result": {
                "item": "farmersdelight:hot_cocoa"
            }
        },
        {
            "type": "farmersdelight:cooking",
            "cookingtime": 200,
            "experience": 1.0,
            "ingredients": [
                [ 
                    { "tag": "minecraft:is_raw_porkchop" },
                    { "tag": "minecraft:is_raw_chicken" },
                    { "tag": "minecraft:is_raw_beef" },
                    { "item": "minecraft:porkchop" },
                    { "item": "minecraft:beef" },
                    { "item": "minecraft:chicken" },
                    { "item": "minecraft:brown_mushroom" }
                ],
                {
                    "tag": "minecraft:is_cabbage"
                },
                {
                    "tag": "minecraft:is_onion"
                },
                {
                    "tag": "minecraft:is_dough"
                }
            ],
            "recipe_book_tab": "misc",
            "result": {
                "item": "farmersdelight:dumplings",
                "count": 2
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
                    "item": "minecraft:is_rice"
                }
            ],
            "recipe_book_tab": "misc",
            "result": {
                "item": "minecraft:cooked_rice"
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
                [ 
                    { "tag": "minecraft:is_raw_beef" },
                    { "item": "minecraft:beef" }
                ],
                {
                    "item": "minecraft:carrot"
                },
                {
                    "item": "minecraft:potato"
                }
            ],
            "recipe_book_tab": "meals",
            "result": {
                "item": "farmersdelight:beef_stew"
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
                [ 
                    { "tag": "minecraft:is_raw_chicken" },
                    { "item": "minecraft:chicken" }
                ],
                {
                    "tag": "minecraft:is_cabbage"
                },
                {
                    "item": "minecraft:carrot"
                },
                [
                    {"item": "minecraft:carrot"},
                    {"item": "minecraft:potato"},
                    {"item": "minecraft:beetroot"},
                    {"tag": "minecraft:is_onion"},
                    {"tag": "minecraft:is_tomato"}
                ]
            ],
            "recipe_book_tab": "meals",
            "result": {
                "item": "farmersdelight:chicken_soup"
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
                    "tag": "minecraft:is_cabbage"
                },
                {
                    "item": "minecraft:beetroot"
                },
                {
                    "item": "minecraft:potato"
                },
                {
                    "item": "minecraft:carrot"
                }
                
            ],
            "recipe_book_tab": "misc",
            "result": {
                "item": "farmersdelight:vegetable_soup"
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
                [ 
                    { "tag": "minecraft:is_raw_fish" },
                    { "item": "minecraft:salmon" },
                    { "item": "minecraft:cod" }
                ],
                {
                    "tag": "minecraft:is_onion"
                },
                {
                    "item": "farmersdelight:tomato_sauce"
                }
            ],
            "recipe_book_tab": "meals",
            "result": {
                "item": "farmersdelight:fish_stew"
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
                     "tag": "minecraft:is_rice" 
                },
                {
                    "item": "minecraft:egg" 
                },
                {
                    "tag": "minecraft:is_onion"
                },
                {
                    "item": "minecraft:carrot"
                }
            ],
            "recipe_book_tab": "misc",
            "result": {
                "item": "farmersdelight:fried_rice"
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
                     "tag": "minecraft:is_cabbage" 
                },
                {
                    "item": "farmersdelight:pumpkin_slice" 
                },
                [
                    {"tag": "minecraft:is_milk"},
                    {"item": "minecraft:milk_bucket"}
                ],
                [
                    {"tag": "minecraft:is_raw_porkchop"},
                    {"item": "minecraft:porkchop"}
                ],
            ],
            "recipe_book_tab": "misc",
            "result": {
                "item": "farmersdelight:pumpkin_soup"
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
                     "tag": "minecraft:is_cabbage" 
                },
                {
                    "item": "minecraft:egg" 
                },
                [
                    {"tag": "minecraft:cod"},
                    {"item": "farmersdelight:cod_slice"}
                ],
                
                {
                    "tag": "minecraft:is_tomato"
                },
            ],
            "recipe_book_tab": "meals",
            "result": {
                "item": "farmersdelight:baked_cod_stew"
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
                    "item": "farmersdelight:tomato_sauce" 
                },
                {
                    "item": "farmersdelight:minced_beef" 
                },
                {
                    "tag": "minecraft:is_pasta"
                },
            ],
            "recipe_book_tab": "meals",
            "result": {
                "item": "farmersdelight:pasta_with_meatballs"
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
                [{
                    "item": "minecraft:mutton" 
                },{
                    "tag": "minecraft:is_raw_mutton" 
                }],
                {
                    "item": "farmersdelight:minced_beef" 
                },
                {
                    "tag": "minecraft:is_pasta"
                },
            ],
            "recipe_book_tab": "meals",
            "result": {
                "item": "farmersdelight:pasta_with_mutton_chop"
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
                    "tag": "minecraft:is_cabbage"
                },
                {
                    "item": "minecraft:brown_mushroom"
                },
                {
                    "item": "minecraft:carrot"
                },
                [
                    {"item": "minecraft:carrot"},
                    {"item": "minecraft:potato"},
                    {"item": "minecraft:beetroot"},
                    {"tag": "minecraft:is_onion"},
                    {"tag": "minecraft:is_tomato"}
                ]
            ],
            "recipe_book_tab": "meals",
            "result": {
                "item": "farmersdelight:vegetable_noodles"
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
                    "tag": "minecraft:is_cabbage"
                },
                {
                    "item": "minecraft:brown_mushroom"
                },
                {
                    "item": "minecraft:carrot"
                },
                [
                    {"item": "minecraft:carrot"},
                    {"item": "minecraft:potato"},
                    {"item": "minecraft:beetroot"},
                    {"tag": "minecraft:is_onion"},
                    {"tag": "minecraft:is_tomato"}
                ]
            ],
            "recipe_book_tab": "meals",
            "result": {
                "item": "farmersdelight:vegetable_noodles"
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
                    "tag": "minecraft:is_pasta"
                },
                {
                    "tag": "minecraft:is_tomato"
                },
                {
                    "item": "minecraft:ink_sac"
                },
                [
                    {"item": "minecraft:cod"},
                    {"item": "minecraft:is_raw_fish"},
                    {"tag": "minecraft:salmon"}
                ]
            ],
            "recipe_book_tab": "meals",
            "result": {
                "item": "farmersdelight:squid_ink_pasta"
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
                    "tag": "minecraft:is_pasta"
                },
                {
                    "tag": "minecraft:is_tomato"
                },
                {
                    "item": "minecraft:ink_sac"
                },
                [
                    {"item": "minecraft:cod"},
                    {"item": "minecraft:is_raw_fish"},
                    {"tag": "minecraft:salmon"}
                ]
            ],
            "recipe_book_tab": "meals",
            "result": {
                "item": "farmersdelight:squid_ink_pasta"
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
                
                {
                    "tag": "minecraft:is_rice"
                },
                {
                    "tag": "minecraft:is_onion"
                },
                {
                    "item": "minecraft:brown_mushroom"
                },
                {
                    "item": "minecraft:potato"
                },
                {
                  "item": "minecraft:sweet_berries"
                },
                [
                    {"item": "minecraft:carrot"},
                    {"item": "minecraft:potato"},
                    {"item": "minecraft:beetroot"},
                    {"tag": "minecraft:is_onion"},
                    {"tag": "minecraft:is_cabbage"},
                    {"tag": "minecraft:is_tomato"}
                ]
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
        },
        {
            "type": "farmersdelight:cooking",
            "cookingtime": 200,
            "experience": 1.0,
            "ingredients": [
                {
                    "item": "minecraft:minced_beef"
                },
                {
                    "item": "minecraft:is_cabbage"
                }
            ],
            "recipe_book_tab": "meals",
            "result": {
                "item": "farmersdelight:cabbage_rolls"
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
                    "tag": "minecraft:is_pasta"
                },
                {
                    "tag": "minecraft:is_cooked_egg"
                },
                {
                    "item": "minecraft:dried_kelp"
                },
                [
                    {
                        "tag": "minecraft:is_raw_porkchop"
                    },
                    {
                        "item": "minecraft:porkchop"
                    }
                ]
            ],
            "recipe_book_tab": "meals",
            "result": {
                "item": "farmersdelight:noodle_soup"
            }
        }
    ]
}
// '{"type": "farmersdelight:cooking", "container": { "item": "minecraft:bowl" }, "cookingtime": 200, "experience": 1.0, "ingredients": [{ "item": "minecraft:baked_potato" }, { "item": "minecraft:rabbit"},{"item": "minecraft:carrot"},[ { "item": "minecraft:brown_mushroom"},{"item": "minecraft:red_mushroom"}]], "recipe_book_tab": "meals", "result": { "item": "minecraft:rabbit_stew" }}'
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
