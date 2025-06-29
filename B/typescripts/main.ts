
import { CookingPotBlock } from "./block/cookingPot/CookingPotBlock";
import { CookingPotBlockEntity } from "./block/cookingPot/CookingPotBlockEntity";
import { CuttingBoardBlock } from "./block/cuttingBoard/CuttingBoardBlock";
import { CuttingBoardBlockEntity } from "./block/cuttingBoard/CuttingBoardBlockEntity";
import { StoveBlock } from "./block/StoveBlock";
import { StoveBlockEntity } from "./block/entity/StoveBlockEntity";
import { Skillet } from "./block/skillet/Skillet";
import { SkilletEntity } from "./block/skillet/SkilletEntity";
import { Knife } from "./item/Knife";
import { CookingPotRecipeRegistries } from "./init/CookingPotRecipeRegistries";
import { Food } from "./item/Food";
import { Cabinets } from "./block/cabinet/Cabinets"
import { CabinetsBlockEntity } from "./block/cabinet/CabinetsBlockEntity";
import { CuttingBoardRegistries } from "./init/CuttingBoardRecipeRegistries";
import { RiceBlock } from "./block/Rice";
import { CookRecipeRegistries } from "./init/CookRecipeRegistries";
import { FarmersBook } from "./item/FarmersBook";
import { BlockFood } from "./block/BlockFood";
import { RiceRollMedleyComponentRegister } from "./customComponents/block/RiceRollMedleyComponent";
import { RiceSeedComponentRegister } from "./customComponents/item/RiceSeedComponent";
import { CropComponentRegister } from "./customComponents/block/CropComponent";
import { InteractComponentRegister } from "./customComponents/block/InteractComponent";
import { WildCropComponentRegister } from "./customComponents/block/WildCropComponent";
import { RichSoilComponentRegister } from "./customComponents/block/RichSoilComponent";
import { RichSoilFarmlandComponentRegister } from "./customComponents/block/RichSoilFarmlandComponent";
import { MushroomColonyComonentRegister } from "./customComponents/block/MushroomColonyComonent";
import { ColoniesComonentRegister } from "./customComponents/item/ColoniesComonent";
import { OrganicCompostComonentRegister } from "./customComponents/block/OrganicCompostComonent";
import { RopeComponentRegister } from "./customComponents/block/RopeComponent";
import { TatamMatComponentRegister } from "./customComponents/block/TatamMatComponent";
import { TatamComponentRegister } from "./customComponents/block/TatamiComponent";
import { StoveComponentRegister } from "./customComponents/block/StoveComponent";
import { IncompleteBlocks } from "./item/IncompleteBlocks";
import { CuttableComponentRegister } from "./customComponents/item/Cuttablecomponent";
import { CookableComonentRegister } from "./customComponents/item/CookableComonent";
import { CabinetComponentRegister } from "./customComponents/block/CabinetComponent.ts";
import { IncreaseProductionComponentRegister } from "./customComponents/item/IncreaseProductionComponent";


CookingPotRecipeRegistries.initCookingPotScoRegistries();
CuttingBoardRegistries.initCuttingBoardScoRegistries();
CookRecipeRegistries.initCookScoRegistries();

new CropComponentRegister()
new CabinetComponentRegister();

new RiceRollMedleyComponentRegister();
new InteractComponentRegister()
new WildCropComponentRegister();
new RichSoilComponentRegister();
new RichSoilFarmlandComponentRegister();
new MushroomColonyComonentRegister();
new OrganicCompostComonentRegister();
new RopeComponentRegister();
new TatamMatComponentRegister();
new TatamComponentRegister();
new StoveComponentRegister();


new CuttableComponentRegister();
new CookableComonentRegister();
new IncreaseProductionComponentRegister();

new ColoniesComonentRegister();
new RiceSeedComponentRegister();
new CookingPotBlock();
new CookingPotBlockEntity();
new CuttingBoardBlock();
new CuttingBoardBlockEntity();
new StoveBlock();
new StoveBlockEntity();
new Skillet();
new SkilletEntity();
new Cabinets();
new CabinetsBlockEntity();
new RiceBlock();
new FarmersBook();
new Food();
new Knife();
new BlockFood();
new IncompleteBlocks();
new CookingPotRecipeRegistries();
