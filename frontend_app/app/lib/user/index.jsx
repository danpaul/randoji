var FormInput = require('./lib/input.jsx');
var LoginForm = require('./lib/login_form.jsx');
var RegisterForm = require('./lib/register_form.jsx');
var Modal = require('./lib/modal.jsx');

var services = require('./lib/services_handler.js');

var LOGIN_BUTTON_STYLE = {
    position: 'absolute',
    top: '5px',
    right: '5px'
}

/**
* Require the following props:
*   endpoint (sql_login endpoint),
*   loginCallback (function called afer login, passed user object)
*   logoutCallback (function called afer logout)
*/
module.exports = React.createClass({
    getInitialState: function(){
        this.loadUser();
        return({
            activeForm: 'login',
            isLoggedIn: false,
            user: null,
            userFormIsVisible: false,
            hasLoaded: false
        });
    },
    handleClose: function(event){
        this.setState({userFormIsVisible: false});
    },
    handleMenuClickLogin: function(event){
        this.setState({activeForm: 'login'})

    },
    handleMenuClickRegister: function(event){
        this.setState({activeForm: 'register'})
    },
    handleLoginButtonClick: function(event){
        var self = this;
        if( !self.state.isLoggedIn ){
            self.setState({userFormIsVisible: true});
            return;
        }
        services.logout(self.props.endpoint, function(err){
            if( err ){
                alert(err);
                return;
            }
            self.setState({isLoggedIn: false}, function(){
                if( self.props.logoutCallback ){
                    self.props.logoutCallback();
                }
            })
        });
    },
    loadUser: function(){
        var self = this;
        services.getUser(self.props.endpoint, function(err, user){
            if( err || !user || !user.id ){
                console.log(err);
                self.setState({hasLoaded: true})
                return;
            }
            self.setState({isLoggedIn: true, user: user, hasLoaded: true},
                          function(){
                if( self.props.loginCallback ){ self.props.loginCallback(user); }
            });
        });
    },
    loginCallback: function(user){
        var self = this;
        self.setState({isLoggedIn: true, user: user,
                       userFormIsVisible: false},
                      function(){

            if( self.props.loginCallback ){
                self.props.loginCallback(user);
            }
        });
    },
    render: function(){
        var self = this;
        if( !self.state.hasLoaded ){ return null; }

        var formVisible = {}
        var forms = ['login', 'register']
        forms.forEach(function(formType){
            formVisible[formType] = (formType === self.state.activeForm);
        })

        return(
            <div className="sql-login-wrap">
                <button
                    className={"sql-login-button button tiny"}
                    style={LOGIN_BUTTON_STYLE}
                    onClick={this.handleLoginButtonClick} >
                    {this.state.isLoggedIn ? 'Logout' : 'Login' }
                </button>

                <Modal
                    visible={this.state.userFormIsVisible}
                    handleClose={this.handleClose} >

                    <div
                        id="sql-log-user-modal"
                        aria-labelledby="User"
                    >
                        <div style={
                            formVisible['login'] ?
                                {display: 'inherit'} : {display: 'none'}
                        }>
                            <LoginForm
                                endpoint={this.props.endpoint}
                                loginCallback={this.loginCallback}
                                handleRegisterClick={this.handleMenuClickRegister}
                            />
                        </div>
                        <div style={
                            formVisible['register'] ?
                                {display: 'inherit'} : {display: 'none'}
                        }><RegisterForm
                            endpoint={this.props.endpoint}
                            loginCallback={this.loginCallback}
                            handleLoginClick={this.handleMenuClickLogin} /></div>

                    </div>

                </Modal>
            </div>
        )
    }
});