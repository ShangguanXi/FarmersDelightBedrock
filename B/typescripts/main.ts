
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
import { RiceBlock } from "./block/Rice";
import { TatamiMatBlock } from "./block/TatamiMatBlock";
import { CookRecipeRegistries } from "./init/CookRecipeRegistries";
import { FarmersBook } from "./item/FarmersBook";
import { FertilizerItem } from "./item/FertilizerItem";
import { Colonies } from "./block/Colonies";
import { BlockFood } from "./block/BlockFood";


CookingPotRecipeRegistries.initCookingPotScoRegistries();
CuttingBoardRegistries.initCuttingBoardScoRegistries();
CookRecipeRegistries.initCookScoRegistries();

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
new RiceBlock();
new TatamiMatBlock();
new FarmersBook();
new Colonies();
new Food();
new Knife();
new FertilizerItem();
new BlockFood();
new CookingPotRecipeRegistries();

