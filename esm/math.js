//命名导出，在被导入时，需要写明具体的名称
function add(a, b) {
    return a + b;
}

function multiply(a, b) {
    return a * b;
}

//1.整体导出
export {add, multiply};

//2.分别导出
export function divide(a, b) {
    return a / b;
}

export const subtract = (a, b) => {
    return a - b;
}

//默认导出，一个模块只能有一个默认导出,在被导入时可以任意命名,注意：default 本质是一个名为 "default" 的命名导出
export default function square(a) {
    return a * a;
}

