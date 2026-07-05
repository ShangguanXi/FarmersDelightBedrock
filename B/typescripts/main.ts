import "./block/cookingPot/CookingPotBlockEntity";
import "./block/cuttingBoard/CuttingBoardBlockEntity";
import "./block/StoveBlockEntity";
import "./block/skillet/SkilletBlockEntity";
import "./item/Knife";
import { CookingPotRecipeRegistries } from "./init/CookingPotRecipeRegistries";
import "./item/Food";
import "./block/CabinetBlockEntity";
import { CuttingBoardRegistries } from "./init/CuttingBoardRecipeRegistries";
import "./block/RiceBlock";
import { CookRecipeRegistries } from "./init/CookRecipeRegistries";
import "./block/BlockFood";
import { RiceSeedComponentRegister } from "./customComponents/item/RiceSeedComponent";
import "./customComponents/block/CropComponent";
import "./customComponents/block/InteractComponent";
import "./customComponents/block/WildCropComponent";
import "./customComponents/block/RichSoilComponent";
import "./customComponents/block/RichSoilFarmlandComponent";
import "./customComponents/block/MushroomClusterComponent";
import "./customComponents/block/OrganicCompostComponent";
import "./customComponents/block/RopeComponent";
import "./customComponents/block/TatamMatComponent";
import "./customComponents/block/TatamiComponent";
import "./customComponents/block/StoveComponent";
import "./item/PartialBlocks";
import "./customComponents/item/CuttableComponent";
import "./customComponents/item/CookableComponent";
import "./customComponents/block/BlockEntityComponent";
import "./customComponents/item/IncreaseProductionComponent";
import "./customComponents/item/SeedComponent";
import { PieComponent } from "./customComponents/block/PieCompostComonent";
import "./block/BasketBlockEntity";
import "./customComponents/item/KnifeComponent";
import "./customComponents/item/ConsumeEffectsComponent";
import "./customComponents/item/FarmersBookComponent";
import "./customComponents/block/DishComponent";
import "./customComponents/block/PastryComponent";
import "./customComponents/block/SugarCaneComponent";
import { PumpkinPie } from "./item/PumpkinPie";

CookingPotRecipeRegistries.initCookingPotScoRegistries();
CuttingBoardRegistries.initCuttingBoardScoRegistries();
CookRecipeRegistries.initCookScoRegistries();

new PieComponent();

new PumpkinPie();


new RiceSeedComponentRegister();



new CookingPotRecipeRegistries();