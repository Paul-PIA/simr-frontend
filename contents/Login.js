import React, { useState } from 'react';

export default function Login() {
    return (
        <div>
            <h2>Login</h2>
            <form>
                <label>
                    Username:<input type='text' name='username'/>
                </label>
                <label>
                    Password:<input type='password' name='password'/>
                </label>
                <button type='submit'>Login</button>
            </form>
        </div>
    )
}