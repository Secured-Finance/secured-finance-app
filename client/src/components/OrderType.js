import React from 'react'

export default function OrderType({type,orders}) {
  const rows= orders.map(({price,amount},i)=>{
    return (
      <div className="order_row" key={i}>         
        <div className="order_price">{price.value} {price.label}</div>
        <div className="order_amount">{amount.value} {amount.label}</div>
        <div className="order_progress" style={{width:`${100-i*10}%`}}></div>
      </div>
    )
  })

  return (
    <div className="order-type">
      <h6 className="order-type_title">{type}</h6>
      <div className="order_rows">
      {
       rows
      }
      </div>
      
    </div>
  )
}
