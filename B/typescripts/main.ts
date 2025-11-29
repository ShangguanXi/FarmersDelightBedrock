import { CookingPotBlock } from "./block/cookingPot/CookingPotBlock";
import { CookingPotBlockEntity } from "./block/cookingPot/CookingPotBlockEntity";
import { CuttingBoardBlock } from "./block/cuttingBoard/CuttingBoardBlock";
import { CuttingBoardBlockEntity } from "./block/cuttingBoard/CuttingBoardBlockEntity";
import { StoveBlock } from "./block/stove/StoveBlock";
import { StoveBlockEntity } from "./block/stove/StoveBlockEntity";
import { Skillet } from "./block/skillet/Skillet";
import { SkilletEntity } from "./block/skillet/SkilletEntity";
import "./item/Knife";
import { CookingPotRecipeRegistries } from "./init/CookingPotRecipeRegistries";
import "./item/Food";
import "./block/CabinetBlockEntity";
import { CuttingBoardRegistries } from "./init/CuttingBoardRecipeRegistries";
import "./block/Rice";
import { CookRecipeRegistries } from "./init/CookRecipeRegistries";
import { BlockFood } from "./block/BlockFood";
import { RiceSeedComponentRegister } from "./customComponents/item/RiceSeedComponent";
import { CropComponentRegister } from "./customComponents/block/CropComponent";
import "./customComponents/block/InteractComponent";
import { WildCropComponent } from "./customComponents/block/WildCropComponent";
import "./customComponents/block/RichSoilComponent";
import { RichSoilFarmlandComponentRegister } from "./customComponents/block/RichSoilFarmlandComponent";
import "./customComponents/block/MushroomColonyComonent";
import "./customComponents/block/OrganicCompostComonent";
import { RopeComponentRegister } from "./customComponents/block/RopeComponent";
import { TatamMatComponentRegister } from "./customComponents/block/TatamMatComponent";
import { TatamComponentRegister } from "./customComponents/block/TatamiComponent";
import { StoveComponentRegister } from "./customComponents/block/StoveComponent";
import "./item/IncompleteBlocks";
import "./customComponents/item/CuttableComponent";
import "./customComponents/item/CookableComponent";
import "./customComponents/block/BlockEntityComponent";
import "./customComponents/item/IncreaseProductionComponent";
import "./customComponents/item/SeedComponent";
import { PieComponent } from "./customComponents/block/PieCompostComonent";
import "./block/BasketBlockEntity";
import "./customComponents/item/KnifeComponent";
import "./customComponents/item/FarmersBookComponent";
import "./customComponents/block/DishComponent";

CookingPotRecipeRegistries.initCookingPotScoRegistries();
CuttingBoardRegistries.initCuttingBoardScoRegistries();
CookRecipeRegistries.initCookScoRegistries();

new CropComponentRegister()
new WildCropComponent();
new StoveComponentRegister();
new PieComponent();


new RichSoilFarmlandComponentRegister();
new RopeComponentRegister();
new TatamMatComponentRegister();
new TatamComponentRegister();

new RiceSeedComponentRegister();


new CookingPotBlock();
new CookingPotBlockEntity();

new CuttingBoardBlock();
new CuttingBoardBlockEntity();

new StoveBlock();
new StoveBlockEntity();

new Skillet();
new SkilletEntity();

new BlockFood();
new CookingPotRecipeRegistries();
