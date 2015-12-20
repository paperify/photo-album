import React from 'react';
import flux from 'fluxify';

var googleApiLoader = require('./GoogleAPILoader');

export default class UserLogin extends React.Component
{
    constructor(props) {
        super(props);
        this.state ={};
    }

    componentDidMount() {
        var _this = this;

        googleApiLoader.authLoaded(function () {
            _this.setState({authLoaded: true});

            googleApiLoader.getAuth2().currentUser.listen(function (user) {
                _this.setState({finishedLoading: true});
                if (user.getBasicProfile()) {
                    var profile = user.getBasicProfile();
                    var profileProxy = {};
                    profileProxy.id = profile.getId();
                    profileProxy.name = profile.getName();
                    profileProxy.thumb = profile.getImageUrl();
                    profileProxy.email = profile.getEmail();
                    _this.setState({loggedInUser: profileProxy});


                }
                var isSignedIn = user.isSignedIn() && user.getBasicProfile();
                _this.setState({isLoggedIn: isSignedIn});
                flux.doAction('userLoaded',isSignedIn?profileProxy:undefined);

            });
        });

        googleApiLoader.clientsLoaded(function () {
            _this.setState({clientsLoaded: true});
        });
    }
    toggleSignIn() {
        if (!googleApiLoader.getAuth2().isSignedIn.get()){
            googleApiLoader.signIn();
        }
        else {
            googleApiLoader.signOut()
        }
    }

    render() {

        var loggedInUserThumb = null;

        if (this.state.loggedInUser)
            loggedInUserThumb = <img src={this.state.loggedInUser.thumb} />;

        var toggleLoginButton =
            <div className="btn-group">
                <a className='btn btn-danger disabled'><i className="fa fa-google-plus" style={{width:16}}></i></a>
                <a className='btn btn-danger' onClick={this.toggleSignIn} style={{width:'12em'}}> Connect with Google</a>
            </div>;

        var logout =  <a onClick={this.toggleSignIn}> Logout</a>
        var component = toggleLoginButton;
        if (this.state.isLoggedIn) {
            component = <div className='navbar-text'>Signed in as <b><a>{this.state.loggedInUser.name}</a></b> | {logout} </div>
        }
        if (this.state.finishedLoading) {
            return component;

        }
        else {
            return <div className='navbar-text'>Loading...</div>
        }
    }
};