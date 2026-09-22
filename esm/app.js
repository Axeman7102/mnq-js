/*
* 命名成员导入
* */

import {add, multiply} from "./math.js"

/*
* 默认成员导入，导入时直接就是重命名的
* */
import sqrtDef from "./math.js"


/*
* 同时导入默认和命名
* */

import sqrtDef, {add, multiply} from "./math.js"

//注意：default 本质是一个名为 "default" 的命名导出
import {default as sqrtDef, add, multiply} from "./math.js"
