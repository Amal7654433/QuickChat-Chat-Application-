import React from 'react'
import { Link } from "react-router-dom";
import { Home, LogOut, MessageSquare, Settings, User } from "lucide-react";
import { userAuthStore } from '../store/userAuth';
// const Navbar = () => {
//     const { logout, authUser } = userAuthStore()
//     return (
//         <nav className="flex w-full justify-between items-center p-4 bg-indigo-600 text-white ">

//             <div className='flex items-center gap-2'>
//                 <h1 className="text-xl font-bold">QuickChat</h1>
//                 <MessageSquare />
//             </div>


//             {authUser && (
//                 <div className="flex items-center gap-4">
//                     <Link to="/" className="flex gap-2 items-center text-white px-3 py-1 rounded hover:bg-gray-900">
//                         <Home className="size-5" />
//                         <span className="hidden sm:inline">Home</span>
//                     </Link>

//                     <Link to="/profile" className="flex gap-2 items-center text-white px-3 py-1 rounded hover:bg-gray-900">
//                         <User className="size-5" />
//                         <span className="hidden sm:inline">Profile</span>
//                     </Link>


//                     <Link to="/settings" className="flex gap-2 items-center text-white px-3 py-1 rounded hover:bg-gray-900">
//                         <Settings className="size-5" />
//                         <span className="hidden sm:inline">Settings</span>
//                     </Link>

//                     <button className="flex gap-2 items-center text-white px-3 py-1 rounded hover:bg-gray-900" onClick={logout}>
//                         <LogOut className="size-5" />
//                         <span className="hidden sm:inline">Logout</span>
//                     </button>
//                 </div>
//             )}
//         </nav>
//     )
// }

// export default Navbar



const Navbar = () => {
    const { logout, authUser } = userAuthStore()
    return (<div className="navbar bg-base-300 shadow-sm">
        <div className="navbar-start">
            <div className="dropdown">
                <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> </svg>
                </div>
                <ul
                    tabIndex={0}
                    className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                    <li>  <Link to="/" >
                        <Home className="size-3" />  Home  
                    </Link></li>

                    <li>  <Link to="/profile" >
                        <User className="size-3" />   Profile  
                    </Link></li>
                    <li>  <Link to="#"  >
                      <Settings  className="size-3" />Settings
                    </Link></li>
                   
                </ul>
            </div>
            <a className="btn btn-ghost text-xl">QuickChat  <MessageSquare /></a>
        </div>

        {/* <ul className="menu menu-horizontal px-1">

                <li><Link to={'/home'}>Home <Home /></Link></li>
                <li><Link to={'/profile'}>Profile<User /></Link></li>
                <li><Link to={'#'}>Settings<Settings /></Link></li>


            </ul> */}
        {authUser && (
            <div className="navbar-center gap-4 hidden lg:flex">
                <Link to="/" className="flex gap-2 items-center text-white px-3 py-1 rounded hover:bg-indigo-600">
                    <Home className="size-5" />
                    <span className="">Home</span>
                </Link>

                <Link to="/profile" className="flex gap-2 items-center text-white px-3 py-1 rounded hover:bg-indigo-600">
                    <User className="size-5" />
                    <span className="">Profile</span>
                </Link>


                <Link to="/settings" className="flex gap-2 items-center text-white px-3 py-1 rounded hover:bg-indigo-600">
                    <Settings className="size-5" />
                    <span className="">Settings</span>
                </Link>

                {/* <button className="flex gap-2 items-center text-white px-3 py-1 rounded hover:bg-gray-900" onClick={logout}>
                        <LogOut className="size-5" />
                        <span className="">Logout</span>
                    </button> */}
            </div>
        )}
        {authUser && (
            <div className='flex navbar-end'>    <button className=" flex gap-2 items-center text-white px-3 py-1 rounded hover:bg-indigo-500" onClick={logout}>
                <LogOut className="size-5" />
                <span className="hidden sm:block">Logout</span>
            </button></div>
        )}
    </div>)
}

export default Navbar