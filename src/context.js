import React, { useState, useContext, useReducer, useEffect } from 'react'
import cartItems from './data'
import reducer from './reducer'
// ATTENTION!!!!!!!!!!
// I SWITCHED TO PERMANENT DOMAIN
const url = 'https://course-api.com/react-useReducer-cart-project'
const AppContext = React.createContext()

const defaultState = {
  loading: false,
  cart: cartItems,
  total: 0,
  amount: 0,
}

const AppProvider = ({ children }) => {
  // 第一步：设置 useReducer: 将 useState 改为 useReducer, 
    // 在 AppProvider 外设置一个 default state 后，
    // 并在 reducer.js 内设置 export 一个 reducer！
  // const [cart, setCart] = useState(cartItems)

  const [state, dispatch] = useReducer(reducer, defaultState)

  // clear Cart 的 第一步骤：在 context 内建立一个 dispatch！
  const clearCart = () => {
    dispatch({type:'CLEAR_CART'})
  } 
  // 下一步：在 AppContext Provider 中 return 之后，
  // （如同 useState 的处理方法）
  // 在 cart container 内，通过 GlobalUseEffect 注入这个 dispatch method！
  // 然后设置一个 button event = clearCart

  // remove one item 的第一步：context 内建立一个 dispatch
  const remove = (id) => {
    dispatch({type:'REMOVE',payload:id})
  } // 与 clearCart 相比，
  // 此时需要加上一个 payload 来承载 remove 的 parameter id，
  // 并在 reducer 中使用 action.payload 来指代这个 id。

  const increase = (id) => {
    dispatch({type:'INCREASE',payload:id})
  }

  const decrease = (id) => {
    dispatch({type:'DECREASE',payload:id})
  }
// INCREASE 和 DECREASE 可以一起放在 TOGGLE AMOUNT 中
// 如何解决 TOGGLE AMOUNT 方向性不明的问题？是 INCREASE, 还是 DECREASE?
    // 答案：除了 id 外，还可以传入一个 type 参数！
  const toggleAmount = (id, type) => {
    dispatch({type:'TOGGLE_AMOUNT',payload:{id,type}})
  }

  // 建立一个 fetchData function, 可以从 url 处 下载 data.
  // 并建立一个 useEffect，每次刷新的时候重新获取 url data.
  const fetchData = async () => {
    dispatch({type:'LOADING'}) // 加载；
    const response = await fetch(url);
    const cart = await response.json();
    // 将 cart 作为 state 中的 cart 注入；
    dispatch({type:'DISPLAY_ITEMS', payload:cart}); 
    // 无论是 'LOADING' 还是 'DISPLAY_ITEMS'，都是在 reducer 中，对 state 作出修改。
  }

  useEffect(() => {
    fetchData();
  },[])

  // 建立一个随动的 total price + total amount 显示
  // 将 dispatch 建立在 useEffect 中, 不需要在 AppProvider 中 export，直接去 reducer 内编辑！

  useEffect(() => {
    // console.log('Hello');
    dispatch({type:'GET_TOTALS'})
  }, [state.cart])

  return (
    <AppContext.Provider
      value={{
        // cart 改为引进 ...state, 包括 loading, total, amount 等
        // cart,
        ...state,
        clearCart,
        remove,
        increase,
        decrease,
        // 部分不在 Provider return 中的 dispatch，放在 useEffect 中！
        toggleAmount
      }}
    >
      {children}
    </AppContext.Provider>
  )
}
// make sure use
export const useGlobalContext = () => {
  return useContext(AppContext)
}

export { AppContext, AppProvider }
