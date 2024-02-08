
import { CookingPotBlock } from "./block/CookingPotBlock";
import { CookingPotBlockEntity } from "./block/entity/CookingPotBlockEntity";
import { CuttingBoardBlock } from "./block/CuttingBoardBlock";
import { CuttingBoardBlockEntity } from "./block/entity/CuttingBoardBlockEntity";
import { StoveBlock } from "./block/StoveBlock";
import { StoveBlockEntity } from "./block/entity/StoveBlockEntity";
import { SKilletBlock } from "./block/SkilletBlock";
import { SkilletBlockEntity } from "./block/entity/SkilletBlockEntity";
import { RichSoilFarmland } from "./block/RichSoilFarmland";
import { OrganicCompost } from "./block/OrganicCompost";
import { Knife } from "./item/Knife";
import { TatamiBlock } from "./block/TatamiBlock";
import { CookingPotRecipeRegistries } from "./init/CookingPotRecipeRegistries";
import { Food } from "./item/Food";
import { Cabinets } from "./block/Cabinets"
import { CabinetsBlockEntity } from "./block/entity/CabinetsBlockEntity";
import { CuttingBoardRegistries } from "./init/CuttingBoardRecipeRegistries";


CookingPotRecipeRegistries.initCookingPotScoRegistries();
CuttingBoardRegistries.initCuttingBoardScoRegistries();

new CookingPotBlock();
new CookingPotBlockEntity();
new CuttingBoardBlock();
new CuttingBoardBlockEntity();
new StoveBlock();
new StoveBlockEntity();
new SKilletBlock();
new SkilletBlockEntity();
new RichSoilFarmland();
new TatamiBlock();
new OrganicCompost();
new Cabinets();
new CabinetsBlockEntity();

new Food();
new Knife();

new CookingPotRecipeRegistries();

