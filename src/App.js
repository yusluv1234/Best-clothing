import React from 'react';
import { connect } from 'react-redux';
import { Redirect, Route, Switch } from 'react-router-dom';
import './App.css';
import Header from './components/header/header-component';
import HomePage from './components/homepage/homepage.component';
import ShopPage from './components/pages/shop/shop.component';
import SignInAndSignUpPage from './components/pages/sign-in-and-sign-up/sign-in-and-sign-up';
import { auth, createUserProfileDocument } from './firebase/firebase.utils';
import { setCurrentUser } from './redux/user/user.action';



class App extends React.Component {
  
  unsubscribeFromAuth = null

  componentDidMount() {
      const { setCurrentUser } = this.props;


    this.unsubscribeFromAuth = auth.onAuthStateChanged(async userAuth => {
      if (userAuth) {
        const userRef = await createUserProfileDocument(userAuth);

        userRef.onSnapshot(snapShot => {
          setCurrentUser({
              id: snapShot.id,
              ...snapShot.data()
          });
        });
      }
      setCurrentUser(userAuth);
    });
  }

    componentWillUnmount() {
      this.unsubscribeFromAuth();
    }

  render() {
    return (
      <div>
        <Header />
        <Switch>
          <Route exact path='/' component={HomePage} />
          <Route path='/shop' component={ShopPage} />
          <Route exact path='/signin' 
          render={() => this.props.currentUser ? ( 
          <Redirect to='/' /> 
          ) : ( <SignInAndSignUpPage />
          )} />
        </Switch>
      </div>
    );
  }
  
}

const mapStateToProps = ({ user }) => ({
    currentUser: user.currentUser
});

const mapDistpatchToProps = dispatch => ({
    setCurrentUser: user => dispatch(setCurrentUser(user))
});

export default connect(mapStateToProps, mapDistpatchToProps)(App);
