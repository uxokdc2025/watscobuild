import type { SearchResult } from "./mock-data";

/* Real Homans product image (Watsco Scene7 CDN), by model-family key grabbed
   from the live category page. */
const img = (key: string) =>
  `https://resource.carrierenterprise.com/is/image/Watscocom/${key}?defaultImage=homans_image-coming-soon&fmt=jpg&wid=320&hei=320&qlt=85&fit=fit,1`;
const ARMSTRONG = img("armstrong_13-14-18-19-ac-hp_en_normal");
const BRYANT_134 = img("bryant_134san_en_normal");
const BRYANT_135 = img("bryant_135san_en_normal");
const BRYANT_148 = img("bryant_148tan_en_normal");
const PAYNE = img("payne_ph5sa_en_normal");

/* Real Residential products grabbed from homans.com's Residential category
   (Armstrong Air + Bryant air conditioners, R-454B). Titles / item # / MFR and
   images are the actual catalog values; price, points and stock are
   representative. */
const RESIDENTIAL: SearchResult[] = [
  { id: "ARA-A7AC13F36P", brand: "Armstrong Air®", mfg: "25H99", title: "Armstrong Air® - A7AC13F - 3-Ton - 13 SEER2 - OMNI Air Conditioner - Single Stage - R-454B", item: "ARA-A7AC13F36P", image: ARMSTRONG, price: 2419.0, points: 2419, stockStatus: "in-stock", allBranchesQty: 42 },
  { id: "134SAN03000N", brand: "Bryant®", mfg: "134SAN03000N", title: "Bryant® - Legacy™ - 2.5-Ton - 14 SEER - Single Stage Air Conditioner - 208/1 - R-454B", item: "134SAN03000N", image: BRYANT_134, price: 2187.5, points: 2187, stockStatus: "in-stock", allBranchesQty: 31 },
  { id: "134SAN03600N", brand: "Bryant®", mfg: "134SAN03600N", title: "Bryant® - Legacy™ - 3.0-Ton - 14 SEER - Single Stage Air Conditioner - 208/1 - R-454B", item: "134SAN03600N", image: BRYANT_134, price: 2310.0, points: 2310, stockStatus: "in-stock", allBranchesQty: 27 },
  { id: "134SAN02400N", brand: "Bryant®", mfg: "134SAN02400N", title: "Bryant® - Legacy™ - 2.0-Ton - 14 SEER - Single Stage Air Conditioner - 208/1 - R-454B", item: "134SAN02400N", image: BRYANT_134, price: 2049.0, points: 2049, stockStatus: "low-stock", allBranchesQty: 6 },
  { id: "PA4SAN53600N", brand: "Bryant®", mfg: "PA4SAN53600N", title: "Bryant® - 3-Ton - 14 SEER2 - Single Stage Air Conditioner - R-454B", item: "PA4SAN53600N", image: PAYNE, price: 2498.0, points: 2498, stockStatus: "in-stock", allBranchesQty: 18 },
  { id: "ARA-A7AC13F30P", brand: "Armstrong Air®", mfg: "25H96", title: "Armstrong Air® - A7AC13F - 2.5-Ton - 13 SEER2 - OMNI Air Conditioner - Single Stage - R-454B", item: "ARA-A7AC13F30P", image: ARMSTRONG, price: 2286.0, points: 2286, stockStatus: "in-stock", allBranchesQty: 24 },
  { id: "ARA-A7AC13F24P", brand: "Armstrong Air®", mfg: "25H95", title: "Armstrong Air® - A7AC13F - 2-Ton - 13 SEER2 - OMNI Air Conditioner - Single Stage - R-454B", item: "ARA-A7AC13F24P", image: ARMSTRONG, price: 2155.0, points: 2155, stockStatus: "in-stock", allBranchesQty: 33 },
  { id: "PA4SAN52400N", brand: "Bryant®", mfg: "PA4SAN52400N", title: "Bryant® - 2-Ton - 14 SEER2 - Single Stage Air Conditioner - R-454B", item: "PA4SAN52400N", image: PAYNE, price: 2176.0, points: 2176, stockStatus: "in-stock", allBranchesQty: 15 },
  { id: "PA4SAN53000N", brand: "Bryant®", mfg: "PA4SAN53000N", title: "Bryant® - 2.5-Ton - 14 SEER2 - Single Stage Air Conditioner - R-454B", item: "PA4SAN53000N", image: PAYNE, price: 2341.0, points: 2341, stockStatus: "in-stock", allBranchesQty: 21 },
  { id: "ARA-A7AC14F36P", brand: "Armstrong Air®", mfg: "25Z25", title: "Armstrong Air® - A7AC14F - 3-Ton - 14 SEER2 - OMNI Air Conditioner - Single Stage - R-454B", item: "ARA-A7AC14F36P", image: ARMSTRONG, price: 2612.0, points: 2612, stockStatus: "in-stock", allBranchesQty: 19 },
  { id: "135SAN03000W", brand: "Bryant®", mfg: "135SAN03000W", title: "Bryant® - Legacy™ - 2.5-Ton - 15 SEER - Single Stage Air Conditioner - 208/1 - R-454B", item: "135SAN03000W", image: BRYANT_135, price: 2498.0, points: 2498, stockStatus: "in-stock", allBranchesQty: 12 },
  { id: "134SAN04800N", brand: "Bryant®", mfg: "134SAN04800N", title: "Bryant® - Legacy™ - 4.0-Ton - 14 SEER - Single Stage Air Conditioner - 208/1 - R-454B", item: "134SAN04800N", image: BRYANT_134, price: 2745.0, points: 2745, stockStatus: "in-stock", allBranchesQty: 9 },
  { id: "148TAN03600W", brand: "Bryant®", mfg: "148TAN03600W", title: "Bryant® - Preferred™ - 148TAN - 3-Ton - 18 SEER2 - Air Conditioner - 2 Stage w/ InteliSense Technology - R-454B", item: "148TAN03600W", image: BRYANT_148, price: 3689.0, points: 3689, stockStatus: "low-stock", allBranchesQty: 4 },
  { id: "135SAN03600W", brand: "Bryant®", mfg: "135SAN03600W", title: "Bryant® - Legacy™ - 3.0-Ton - 15 SEER - Single Stage Air Conditioner - 208/1 - R-454B", item: "135SAN03600W", image: BRYANT_135, price: 2615.0, points: 2615, stockStatus: "in-stock", allBranchesQty: 14 },
  { id: "134SAN04200N", brand: "Bryant®", mfg: "134SAN04200N", title: "Bryant® - Legacy™ - 3.5-Ton - 14 SEER - Single Stage Air Conditioner - 208/1 - R-454B", item: "134SAN04200N", image: BRYANT_134, price: 2560.0, points: 2560, stockStatus: "in-stock", allBranchesQty: 11 },
  { id: "ARA-A7AC13F48P", brand: "Armstrong Air®", mfg: "25J02", title: "Armstrong Air® - A7AC13F - 4-Ton - 13 SEER2 - OMNI Air Conditioner - Single Stage - R-454B", item: "ARA-A7AC13F48P", image: ARMSTRONG, price: 2690.0, points: 2690, stockStatus: "in-stock", allBranchesQty: 16 },
];

/** Real product sets per category slug (extend as more categories are built). */
export const CATEGORY_RESULTS: Record<string, SearchResult[]> = {
  residential: RESIDENTIAL,
};
