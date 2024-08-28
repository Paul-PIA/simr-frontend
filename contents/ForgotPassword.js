import React, { useState } from 'react';

export default function ForgotPassword() {
    return (
        <div>
            <h2>Forgot Password</h2>
            <form>
                <label>
                    Email:<input type='email' name='email'/>
                </label>
                <button type='submit'>Login</button>
            </form>
        </div>
    )
}