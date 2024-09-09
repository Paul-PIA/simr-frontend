

import React from "react";
import { apiClient } from "../services/api";

export default function activate(){
    if (typeof window !== 'undefined'){
        const url=window.location.href;
        const params = new URLSearchParams(new URL(url).search);
    apiClient({
        method:'POST',
        path:'auth/registration/verify-email',
        data:{key:params.get('key')}})}
    return ( <div>
        <h1>Your account creation has been confirmed</h1>
      </div>)
}