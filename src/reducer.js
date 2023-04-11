import CartItem from "./CartItem"

const reducer = (state, action) => {
    if (action.type === 'CLEAR_CART'){
        return {
            ...state,
            cart: []
        }
    }
    if (action.type === 'REMOVE'){
        const newCart = state.cart.filter((item) => item.id !== action.payload)
        return {
            ...state,
            cart: newCart
        }
    }
// INCREASE 和 DECREASE 可以一起放在 TOGGLE AMOUNT 中
// 如何解决 TOGGLE AMOUNT 方向性不明的问题？是 INCREASE, 还是 DECREASE?
    // 答案：除了 id 外，还可以传入一个 type 参数！
    if (action.type === 'TOGGLE_AMOUNT'){
        let tempCart = state.cart.map((cartItem) => {
            if (action.payload.id === cartItem.id){
                if (action.payload.type === '+'){
                    return {...cartItem, amount: cartItem.amount + 1}
                } else {
                    return {...cartItem, amount: cartItem.amount - 1}
                }
            }
            return cartItem // 更改的不是本 cartItem 的情况下, 则直接返回这个 cartItem，不需要对 cartItem 中的 amount 作出修改
        })
        // 亦要针对 decrease 的负数情况做出修改, 做到一旦 等于 0 则剔除出 cart.
        const newCart = tempCart.filter((cartItem) => { return cartItem.amount > 0 });
        return {
            ...state,
            cart: newCart
        }
    }
    if (action.type === 'INCREASE'){
        let newCart = state.cart.map((cartItem) => {
            if (cartItem.id === action.payload){ // cartItem 正是需要更改 amount 的
                return {...cartItem, amount: cartItem.amount + 1} 
                // 必须是 amount: item.amount + 1, 
                // 而不能是 amount: amount + 1
            } // 当 cartItem 并非所寻找的 item 时：保持原样
            return cartItem 
        })
        return {
            ...state,
            cart: newCart
        }
    }
    if (action.type === 'DECREASE'){
        let tempCart = state.cart.map((cartItem) => {
            if (cartItem.id === action.payload){
                // if (cartItem.amount < 1){ 
                //   return {...cartItem, amount: 0} }
                // 除了 amount 为负数时强制归零，是否可以通过某种方式将 <0 的 cartItem 直接删除？
                    // 可以对 newCart 直接进行 filter 操作，筛出 amount > 0 的 cartItem 留在新 array 中！
                return {...cartItem, amount: cartItem.amount - 1}
            }
            return cartItem
        })

        let newCart = tempCart.filter((cartItem) => {return cartItem.amount > 0})

        return {
            ...state,
            // cart: tempCart
            cart: newCart
        }
    }
    if (action.type === 'GET_TOTALS'){
        // 使用 reduce method 来计算累计值
        // 用 object {total, amount} 来替代 reduce 示例中的 单个 initial value

        // 并用 {total,amount} object 在运算过程中，表达为：cartTotal
        let {total, amount} = state.cart.reduce(
            (cartTotal, cartItem) => {
                // cartItem 可被分解为 amount 和 price;
                const {price, amount} = cartItem;
                // cartTotal.amount = cartTotal.amount + amount;
                // cartTotal.total = cartTotal.total + price * amount;
                cartTotal.amount += amount;
                cartTotal.total += price * amount; // price * amount 是每个单品的 item total， 经过 reduce 全部加起来。
                // 如果 reduce 内存在一个 callback，则必须 return 出 accumulator 的 final stage. 
                return cartTotal 
            },
            {total:0, amount:0} // accumulator cartTotal 的 initial value 
        );
        // 转变为 浮点数，再进行 缩短处理
        total = parseFloat(total).toFixed(2);
        return {...state, total, amount}
    }
    // FETCH DATA
    if (action.type === 'LOADING') {
        return {...state, loading:true}
    }
    if (action.type === 'DISPLAY_ITEMS') {
        return {...state, cart: action.payload, loading:false}
    }


    // 用一个 throw Error 取代 return state
    // return state 
    throw new Error ('No Matching Action Type!')
}

export default reducer
// 以上是最简单版本的 reducer.js