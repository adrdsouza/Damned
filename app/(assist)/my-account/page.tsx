'use client';

import { useState } from "react"
import Auth from "@/components/my-account/auth/page";
import Account from "@/components/my-account/account/page";

export default function Myaccount() {
    
    const [isLogin, setLogin] = useState<Boolean>(true);
    
    return (
        <div>
            {
                isLogin && <Account />
            }
            {
                !isLogin && <Auth />
            }
        </div>
    )
}