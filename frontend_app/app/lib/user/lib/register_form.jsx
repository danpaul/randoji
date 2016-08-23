var Alert = require('./alert.jsx');
var FormInput = require('./input.jsx');
var servicesHandler = require('./services_handler.js')

module.exports = React.createClass({

    passwordMinLength: 8,
    usernameMinLength: 3,
    errorEmail: 'Email address is not valid.',
    errorPasswordsDontMatch: 'The passwords do not match.',
    errorPasswordLength: 'The password must be at least 8 characters.',
    errorUsernameLength: 'The username can only contain letters, numbers, underscores, dots and dashes and must be at least 3 characters.',

    getInitialState: function(){
        return({errorMessage: ''});
    },

    handleSubmit: function(event){
        event.preventDefault()
        var self = this;

        var email = this.refs.email.getInputValue();
        var username = this.refs.username.getInputValue();
        var passwordOne = this.refs.password.getInputValue();
        var passwordTwo = this.refs.confirmPassword.getInputValue();

        var validationResult = this.validate(email,
                                             username,
                                             passwordOne,
                                             passwordTwo);

        if( validationResult !== true ){
            this.setState({errorMessage: validationResult})
            return;
        }

        console.log('Registering ' + email);
        servicesHandler.register(this.props.endpoint,
                                 email,
                                 username,
                                 passwordOne,
                                 function(err, response){
            if( err ){
                console.log(err);
                self.setState({errorMessage: err});
                return;
            }

            // console.log(response);
            self.setState({errorMessage: ''});

            if( self.props.loginCallback ){
                self.props.loginCallback(response.user);
            }
        })
    },
    render: function(){
        return(
            <div className="sql-login-register">
                <Alert message={this.state.errorMessage} />
                <form method="POST" onSubmit={this.handleSubmit} >
                    <FormInput
                        name="email"
                        type="text"
                        label="Email"
                        ref="email"/>
                    <FormInput
                        name="username"
                        type="text"
                        label="Username"
                        ref="username"/>
                    <FormInput
                        name="password"
                        type="password"
                        label="Password"
                        ref="password"/>
                    <FormInput
                        name="confirmPassword"
                        type="password"
                        label="ConfirmPassword"
                        ref="confirmPassword"/>
                    <input
                        className={"button tiny"}
                        type="submit"
                        value="Register" />
                    <a
                        style={{ paddingLeft: '12px', fontSize: '10px' }}
                        onClick={this.props.handleLoginClick} >
                        Login
                    </a>
                </form>
            </div>
        )
    },
    validate: function(email, username, passwordOne, passwordTwo){
        if( !validateEmail(email) ){
            return this.errorEmail;
        }
        if( !validateUsername(username, this.usernameMinLength)){
            return this.errorUsernameLength;
        }
        if( passwordOne !== passwordTwo ){
            return this.errorPasswordsDontMatch;
        }
        if( passwordOne.length < this.passwordMinLength ){
            return this.errorPasswordLength;
        }
        return true;
    }
})

function validateUsername(username, minLength){
    if( username.length < minLength ){
        return false;
    }
    return(/^([a-zA-Z0-9]|\-|\_|\.)+$/.test(username));
}

// http://stackoverflow.com/questions/46155/validate-email-address-in-javascript
function validateEmail(email) {
    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    return re.test(email);
}