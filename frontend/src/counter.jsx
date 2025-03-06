import React, { useEffect, useRef, useState } from 'react'

const counter = (props) => {
    const [value, setValue] = useState(0)
    const [val,setVal]=useState('')
    useEffect(() => {

        return (() => {
            console.log('hello')
            document.title = 'davdi'
        })

    }, [value])
    const inuputref=useRef(null)

    return (
        <>
            <button onClick={() => setValue(value + 1)}>increment</button>

            <div>{props.token}</div>

            <input type='text' onChange={(e)=>setVal(e.target.value)}/>
            <button onClick={() => setValue(value - 1)}>decrement</button>
        </>

    )
}

export default counter