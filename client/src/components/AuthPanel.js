import React from 'react';
import SignIn from './SignIn';
import SignUp from './SignUp';
import './AuthPanel.css';

const AuthPanel = ({ authView, switchToSignin, switchToSignup, onClose, onSuccess }) => {
    const isSignInView = authView === "signin";

    return (
        <div className="auth-panel-container">
            <div className="auth-panel-content-wrapper">

                {/* Onglets */}
                <div className="auth-panel-tabs">
                    <div 
                        className={`auth-tab ${isSignInView ? "active" : ""}`}
                        onClick={switchToSignin}
                    >
                        SE CONNECTER
                    </div>

                    <div 
                        className={`auth-tab ${!isSignInView ? "active" : ""}`}
                        onClick={switchToSignup}
                    >
                        CRÉER UN COMPTE
                    </div>
                </div>

                {/* Formulaire */}
                <div className="auth-panel-form-area">
                    {isSignInView ? (
                        <SignIn 
                            onClose={onClose}
                            onSuccess={onSuccess}
                            onSignupClick={switchToSignup}
                        />
                    ) : (
                        <SignUp
                            onClose={onClose}
                            onSuccess={onSuccess}
                            onSigninClick={switchToSignin}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default AuthPanel;