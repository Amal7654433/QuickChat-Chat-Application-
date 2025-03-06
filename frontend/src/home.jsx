import React from 'react'

const Home = ({ values }) => {
    return (
        <>
            {
                values.map((name) => {
                   return (<div className='text-red-500' >{name}</div>) 
                })
            }
        </>
    )
}
export default Home