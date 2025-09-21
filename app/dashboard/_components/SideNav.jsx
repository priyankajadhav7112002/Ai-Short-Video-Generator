'use client'
import { CircleUser, FileVideo,  PanelsTopLeft, ShieldPlus } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { use } from 'react'

const SideNav = () => {
    const MenuOption = [
        {id:1, name:"Dashboard", icon:PanelsTopLeft, path:"/dashboard"},
        {id:2, name:"Create New", icon:FileVideo, path:"/dashboard/create-new"},
        {id:3, name:"Upgrade", icon:ShieldPlus, path:"/upgrade"},
        {id:4, name:"Account", icon:CircleUser, path:"/account"},
    ]

    const path = usePathname();
  return (
    <div className='w-64 h-screen shadow-md p-5'>
        <div className='grid gap-3'>
            {MenuOption.map((item,index)=>(
                <Link href={item.path} key={index}>
                <div className={`flex gap-3 items-center p-3 rounded-md cursor-pointer hover:bg-primary hover:text-white ${path==item.path &&'bg-primary text-white'}`} >
                <item.icon/>
                <h2>{item.name}</h2>
                </div>
                </Link>
            ))}
        </div>
    </div>
  )
}

export default SideNav