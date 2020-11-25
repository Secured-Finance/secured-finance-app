import React from 'react'
import OrderType from './OrderType'



export default function OrderBook() {
  return (
    <div className='orderbook'>
      <h6 className="orderbook__title">Order book</h6>
      <div className="orderbook__heads">
        <div className="orderbook__head">Price</div>
        <div className="orderbook__head">Amount</div>
      </div>
      <OrderType
      type={'lenders'}
      orders={[
        {price:{value:100, label:'eth'},amount:{value:200, label:'fil'}},
        {price:{value:100, label:'eth'},amount:{value:200, label:'fil'}},
        {price:{value:100, label:'eth'},amount:{value:200, label:'fil'}},
        {price:{value:100, label:'eth'},amount:{value:200, label:'fil'}},
        {price:{value:100, label:'eth'},amount:{value:200, label:'fil'}},
        {price:{value:100, label:'eth'},amount:{value:200, label:'fil'}},
        {price:{value:100, label:'eth'},amount:{value:200, label:'fil'}},
      ]}
      />
    </div>
  )
}
