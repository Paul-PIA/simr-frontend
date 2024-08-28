import React,{ createContext, useState } from 'react';
import { Layout } from 'antd';
import _Footer from './Footer';
import ForgotPassword from '../contents/ForgotPassword';
import Register from '../contents/Register';
import Login from '../contents/Login';

const { Content } = Layout;
const FormContext = createContext();

export default function Forms({ item }) {
    const [currentForm, setCurrentForm] = useState('login');

    const renderButton = () => {
        return (
            <>
                {currentForm === 'login' && (
                    <div>
                        <button onClick={() => setCurrentForm('register')}>Not have account?</button>
                        <button onClick={() => setCurrentForm('forgot')}>Forgot Password?</button>
                    </div>
                )}
                {currentForm === 'forgot' && (
                    <div>
                        <button onClick={() => setCurrentForm('login')}>Login</button>
                        <button onClick={() => setCurrentForm('register')}>Not have account?</button>
                    </div>
                )}
                {currentForm === 'register' && (
                    <div>
                        <button onClick={() => setCurrentForm('login')}>Have already an account?</button>
                    </div>
                )}
            </>
        );
    };

    const renderForm = () => {
        switch (currentForm) {
            case 'forgot':
                return <ForgotPassword />;
            case 'register':
                return <Register />;  
            default:
                return <Login />;
        }
    };
    
    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Content style={{ padding: '0 24px', minHeight: 280 }}>
                <div>
                    {renderForm()}
                    {renderButton()}
                </div>
            </Content>
            <_Footer />
        </Layout>
    );
}