export const vanillaCookingPotRecipe = {
    "recipe": [
        //finish
        {
            'identifer': 'farmersdelight:bone_broth',
            'tags': ['cooking_pot'],
            'priority': 0,
            "time": 200,
            "container": {
                "item": "minecraft:bowl"
            },
            "ingredients": [
                {
                    "item": "minecraft:red_mushroom"
                },
                {
                    "item": "minecraft:bone"
                }
            ],
            "result": {
                "item": "farmersdelight:bone_broth"
            }
        },
        //finish
        {
            'identifer': 'farmersdelight:glow_berry_custard',
            'tags': ['cooking_pot'],
            'priority': 0,
            "time": 200,
            "ingredients": [
                {
                    "item": "farmersdelight:milk_bottle"
                },
                {
                    "item": "minecraft:glow_berries"
                },
                {
                    "item": "minecraft:egg"
                },
                {
                    "item": "minecraft:sugar"
                }
            ],
            "result": {
                "item": "farmersdelight:glow_berry_custard"
            }
        },
        //finish
        {
            'identifer': 'farmersdelight:apple_cider',
            'tags': ['cooking_pot'],
            'priority': 0,
            "time": 200,
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
            "result": {
                "item": "farmersdelight:apple_cider"
            }
        },
        //finish
        {
            'identifer': 'farmersdelight:hot_cocoa',
            'tags': ['cooking_pot'],
            'priority': 0,
            "time": 200,
            "experience": 1.0,
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
                    "item": "farmersdelight:milk_bottle"
                }
            ],
            "recipe_book_tab": "drinks",
            "result": {
                "item": "farmersdelight:hot_cocoa"
            }
        },
        //finish
        {
            'identifer': 'farmersdelight:dumplings',
            'tags': ['cooking_pot'],
            'priority': 0,
            "type": "farmersdelight:cooking",
            "time": 200,
            "experience": 1.0,
            "ingredients": [
                [
                    { "item": "minecraft:porkchop" },
                    { "item": "minecraft:beef" },
                    { "item": "minecraft:chicken" },
                    { "item": "minecraft:brown_mushroom" },
                    { "tag": "farmersdelight:is_raw_porkchop" },
                    { "tag": "farmersdelight:is_raw_chicken" },
                    { "tag": "farmersdelight:is_raw_beef" },
                ],
                { "tag": "farmersdelight:is_cabbage" },
                {
                    "tag": "farmersdelight:is_onion"
                },
                {
                    "tag": "farmersdelight:is_dough"
                }
            ],
            "recipe_book_tab": "misc",
            "result": {
                "item": "farmersdelight:dumplings",
                "count": 2
            }
        },
        //finish
        {
            'identifer': 'farmersdelight:cooked_rice',
            'tags': ['cooking_pot'],
            'priority': 0,
            "container": {
                "item": "minecraft:bowl"
            },
            "time": 200,
            "experience": 1.0,
            "ingredients": [
                {
                    "tag": "farmersdelight:is_rice"
                }
            ],
            "recipe_book_tab": "misc",
            "result": {
                "item": "farmersdelight:cooked_rice"
            }
        },
        //finish
        {
            'identifer': 'farmersdelight:beef_stew',
            'tags': ['cooking_pot'],
            'priority': 0,
            "container": {
                "item": "minecraft:bowl"
            },
            "time": 200,
            "experience": 1.0,
            "ingredients": [
                [
                    { "tag": "farmersdelight:is_raw_beef" },
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
        //finish
        {
            'identifer': 'farmersdelight:chicken_soup',
            'tags': ['cooking_pot'],
            'priority': 0,
            "container": {
                "item": "minecraft:bowl"
            },
            "time": 200,
            "experience": 1.0,
            "ingredients": [
                [
                    { "tag": "farmersdelight:is_raw_chicken" },
                    { "item": "minecraft:chicken" }
                ],
                {
                    "tag": "farmersdelight:is_cabbage"
                },
                {
                    "item": "minecraft:carrot"
                },
                [
                    { "item": "minecraft:carrot" },
                    { "item": "minecraft:potato" },
                    { "item": "minecraft:beetroot" },
                    { "tag": "farmersdelight:is_onion" },
                    { "tag": "farmersdelight:is_tomato" }
                ]
            ],
            "recipe_book_tab": "meals",
            "result": {
                "item": "farmersdelight:chicken_soup"
            }
        },
        //finish
        {
            'identifer': 'farmersdelight:vegetable_soup',
            'tags': ['cooking_pot'],
            'priority': 0,
            "container": {
                "item": "minecraft:bowl"
            },
            "time": 200,
            "experience": 1.0,
            "ingredients": [
                {
                    "tag": "farmersdelight:is_cabbage"
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
        //finish
        {
            'identifer': 'farmersdelight:fish_stew',
            'tags': ['cooking_pot'],
            'priority': 0,
            "time": 200,
            "experience": 1.0,
            "ingredients": [
                [
                    { "tag": "farmersdelight:is_raw_fish" },
                    { "item": "minecraft:salmon" },
                    { "item": "minecraft:cod" }
                ],
                {
                    "tag": "farmersdelight:is_onion"
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
        //finish
        {
            'identifer': 'farmersdelight:fried_rice',
            'tags': ['cooking_pot'],
            'priority': 0,
            "container": {
                "item": "minecraft:bowl"
            },
            "time": 200,
            "experience": 1.0,
            "ingredients": [
                {
                    "tag": "farmersdelight:is_rice"
                },
                {
                    "item": "minecraft:egg"
                },
                {
                    "tag": "farmersdelight:is_onion"
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
        //finish
        {
            'identifer': 'farmersdelight:pumpkin_soup',
            'tags': ['cooking_pot'],
            'priority': 0,
            "container": {
                "item": "minecraft:bowl"
            },
            "time": 200,
            "experience": 1.0,
            "ingredients": [
                {
                    "tag": "farmersdelight:is_cabbage"
                },
                {
                    "item": "farmersdelight:pumpkin_slice"
                },
                {
                    "tag": "farmersdelight:is_milk"
                },
                [
                    { "tag": "farmersdelight:is_raw_porkchop" },
                    { "item": "minecraft:porkchop" }
                ],
            ],
            "recipe_book_tab": "misc",
            "result": {
                "item": "farmersdelight:pumpkin_soup"
            }
        },
        //finish
        {
            'identifer': 'farmersdelight:tomato_sauce',
            'tags': ['cooking_pot'],
            'priority': 0,
            "container": {
                "item": "minecraft:bowl"
            },
            "time": 200,
            "experience": 1.0,
            "ingredients": [
                [
                    { "tag": "farmersdelight:is_tomato" }
                ],
                [
                    { "tag": "farmersdelight:is_tomato" }
                ]
            ],
            "result": {
                "item": "farmersdelight:tomato_sauce"
            }
        },
        //finish
        {
            'identifer': 'farmersdelight:baked_cod_stew',
            'tags': ['cooking_pot'],
            'priority': 0,
            "container": {
                "item": "minecraft:bowl"
            },
            "time": 200,
            "experience": 1.0,
            "ingredients": [
                {
                    "tag": "farmersdelight:is_cabbage"
                },
                {
                    "item": "minecraft:egg"
                },
                [
                    { "item": "minecraft:cod" },
                    { "tag": "farmersdelight:cod_slice" }
                ],
                {
                    "tag": "farmersdelight:is_tomato"
                },
            ],
            "recipe_book_tab": "meals",
            "result": {
                "item": "farmersdelight:baked_cod_stew"
            }
        },
        //finish
        {
            'identifer': 'farmersdelight:pasta_with_meatballs',
            'tags': ['cooking_pot'],
            'priority': 0,
            "time": 200,
            "experience": 1.0,
            "ingredients": [
                {
                    "item": "farmersdelight:tomato_sauce"
                },
                {
                    "item": "farmersdelight:minced_beef"
                },
                {
                    "tag": "farmersdelight:is_pasta"
                },
            ],
            "recipe_book_tab": "meals",
            "result": {
                "item": "farmersdelight:pasta_with_meatballs"
            }
        },
        //finish
        {
            'identifer': 'farmersdelight:pasta_with_mutton_chop',
            'tags': ['cooking_pot'],
            'priority': 0,
            "time": 200,
            "experience": 1.0,
            "ingredients": [
                [
                    {
                        "item": "minecraft:mutton"
                    },
                    {
                        "tag": "farmersdelight:is_raw_mutton"
                    }
                ],
                {
                    "item": "farmersdelight:tomato_sauce"
                },
                {
                    "tag": "farmersdelight:is_pasta"
                },
            ],
            "recipe_book_tab": "meals",
            "result": {
                "item": "farmersdelight:pasta_with_mutton_chop"
            }
        },
        //finish
        {
            'identifer': 'farmersdelight:vegetable_noodles',
            'tags': ['cooking_pot'],
            'priority': 0,
            "container": {
                "item": "minecraft:bowl"
            },
            "time": 200,
            "experience": 1.0,
            "ingredients": [
                {
                    "tag": "farmersdelight:is_cabbage"
                },
                {
                    "item": "minecraft:brown_mushroom"
                },
                {
                    "item": "minecraft:carrot"
                },
                {
                    "item": "farmersdelight:raw_pasta"
                },
                [
                    { "item": "minecraft:carrot" },
                    { "item": "minecraft:potato" },
                    { "item": "minecraft:beetroot" },
                    { "tag": "farmersdelight:is_onion" },
                    { "tag": "farmersdelight:is_tomato" }
                ]
            ],
            "recipe_book_tab": "meals",
            "result": {
                "item": "farmersdelight:vegetable_noodles"
            }
        },
        //finish
        {
            'identifer': 'farmersdelight:squid_ink_pasta',
            'tags': ['cooking_pot'],
            'priority': 0,
            "container": {
                "item": "minecraft:bowl"
            },
            "time": 200,
            "experience": 1.0,
            "ingredients": [
                {
                    "tag": "farmersdelight:is_pasta"
                },
                {
                    "tag": "farmersdelight:is_tomato"
                },
                {
                    "item": "minecraft:ink_sac"
                },
                [
                    { "item": "minecraft:cod" },
                    { "tag": "farmersdelight:is_raw_fish" },
                    { "tag": "minecraft:salmon" }
                ]
            ],
            "recipe_book_tab": "meals",
            "result": {
                "item": "farmersdelight:squid_ink_pasta"
            }
        },
        //finish
        {
            'identifer': 'farmersdelight:stuffed_pumpkin_block_item',
            'tags': ['cooking_pot'],
            'priority': 0,
            "container": {
                "item": "minecraft:pumpkin"
            },
            "time": 200,
            "experience": 2.0,
            "ingredients": [
                {
                    "tag": "farmersdelight:is_rice"
                },
                {
                    "tag": "farmersdelight:is_onion"
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
                    { "item": "minecraft:carrot" },
                    { "item": "minecraft:potato" },
                    { "item": "minecraft:beetroot" },
                    { "tag": "farmersdelight:is_onion" },
                    { "tag": "farmersdelight:is_cabbage" },
                    { "tag": "farmersdelight:is_tomato" }
                ]
            ],
            "recipe_book_tab": "meals",
            "result": {
                "item": "farmersdelight:stuffed_pumpkin_block_item"
            }
        },
        //finish
        {
            'identifer': 'farmersdelight:rabbit_stew',
            'tags': ['cooking_pot'],
            'priority': 0,
            "container": {
                "item": "minecraft:bowl"
            },
            "time": 200,
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
        //finish
        {
            'identifer': 'farmersdelight:cabbage_rolls',
            'tags': ['cooking_pot'],
            'priority': 0,
            "time": 200,
            "experience": 1.0,
            "ingredients": [
                [
                    {
                        "tag": "farmersdelight:cabbage_roll_ingredients"
                    },
                    {
                        "item": "minecraft:porkchop"
                    },
                    {
                        "item": "minecraft:carrot"
                    },
                    {
                        "item": "minecraft:potato"
                    },
                    {
                        "item": "minecraft:beetroot"
                    },
                    {
                        "item": "minecraft:brown_mushroom"
                    },
                    {
                        "item": "minecraft:red_mushroom"
                    },
                    {
                        "item": "minecraft:egg"
                    },
                    {
                        "item": "minecraft:beef"
                    },
                    {
                        "item": "minecraft:chicken"
                    },
                    {
                        "item": "minecraft:salmon"
                    },
                    {
                        "item": "minecraft:cod"
                    }
                ],
                {
                    "tag": "farmersdelight:is_cabbage"
                }
            ],
            "recipe_book_tab": "meals",
            "result": {
                "item": "farmersdelight:cabbage_rolls"
            }
        },
        //finish
        {
            'identifer': 'farmersdelight:noodle_soup',
            'tags': ['cooking_pot'],
            'priority': 0,
            "container": {
                "item": "minecraft:bowl"
            },
            "time": 200,
            "experience": 1.0,
            "ingredients": [
                {
                    "tag": "farmersdelight:is_pasta"
                },
                {
                    "tag": "farmersdelight:is_cooked_egg"
                },
                {
                    "item": "minecraft:dried_kelp"
                },
                [
                    {
                        "tag": "farmersdelight:is_raw_porkchop"
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
        },
        {
            'identifer': 'farmersdelight:dog_food',
            'tags': ['cooking_pot'],
            'priority': 0,
            "container": {
                "item": "minecraft:bowl"
            },
            "time": 200,
            "experience": 1.0,
            "ingredients": [
                {
                    "tag": "farmersdelight:is_rice"
                },
                {
                    "item": "minecraft:bone_meal"
                },
                {
                    "item": "minecraft:rotten_flesh"
                },
                [
                    {
                        "tag": "farmersdelight:wolf_prey"
                    },
                    {
                        "item": "minecraft:chicken"
                    },
                    {
                        "item": "minecraft:mutton"
                    }
                ]
            ],
            "recipe_book_tab": "meals",
            "result": {
                "item": "farmersdelight:dog_food"
            }
        },
        //finish
        {
            'identifer': 'farmersdelight:mushroom_rice',
            'tags': ['cooking_pot'],
            'priority': 0,
            "container": {
                "item": "minecraft:bowl"
            },
            "time": 200,
            "experience": 1.0,
            "ingredients": [
                {
                    "item": "minecraft:brown_mushroom"
                },
                {
                    "item": "minecraft:red_mushroom"
                },
                {
                    "item": "minecraft:carrot"
                },
                {
                    "item": "farmersdelight:rice"
                }
            ],
            "recipe_book_tab": "meals",
            "result": {
                "item": "farmersdelight:mushroom_rice"
            }
        }
    ]
};
//# sourceMappingURL=cookingPotRecipe.js.map