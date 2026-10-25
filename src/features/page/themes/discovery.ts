/** Categories describe page purposes; they do not restrict the owner's business. */
export const LOOK_GROUPS = [
 {id:'all',name:'All',looks:[]},
 {id:'services',name:'Services',looks:['open','service','personal','orchard','lune','forge']},
 {id:'shops',name:'Shops & menus',looks:['showroom','clay','kiln']},
 {id:'creative',name:'Portfolios & founders',looks:['atelier','founder','personal']},
 {id:'dark',name:'Dark',looks:['ink','forge']},
] as const;
