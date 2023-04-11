import React from 'react'
import CartItem from './CartItem'
import { useGlobalContext } from './context'

const CartContainer = () => {
  const { cart, total, clearCart } = useGlobalContext()
  if (cart.length === 0) {
    return (
      <section className='cart'>
        {/* cart header */}
        <header>
          <h2>your bag</h2>
          <h4 className='empty-cart'>is currently empty</h4>
        </header>
      </section>
    )
  }
  return (
    <section className='cart'>
      {/* cart header */}
      <header>
        <h2>your bag</h2>
      </header>
      {/* cart items */}
      <div>
        {cart.map((item) => {
          return <CartItem key={item.id} {...item} />
        })}
      </div>
      {/* cart footer */}
      <footer>
        <hr />
        <div className='cart-total'>
          <h4>
            total <span>${total}</span>
          </h4>
        </div>
        <button
          className='btn clear-btn'
          onClick={clearCart} 
          // 注入 clearCart 后，使用 onClick invoke 这个 method
          // 下一步是确保在 reducer.js 中 handle 这个 dispatch！
        >
          clear cart
        </button>
      </footer>
    </section>
  )
}

export default CartContainer
