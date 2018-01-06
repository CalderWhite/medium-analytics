import React, {Component} from "React";
import "../../css/app/signup.scss";
import firebaseUtils from "./firebaseConnector.js";

// import 1st party components
import FaceBookButton from "./components/FaceBookButton.js"
import GoogleButton from "./components/GoogleButton.js";

export default class SignUpPage extends Component{
	constructor(props){
		super(props);
		this.state = {
			firebase: props.firebase,
			firebaseUtils: new firebaseUtils(this.props.firebase),
			emailInput:'',
			passwordInput:''
		}
		this.signUp = this.signUp.bind(this);
		this.signUpWithFacebook = this.signUpWithFacebook.bind(this);
		this.signUpWithGoogle = this.signUpWithGoogle.bind(this);
		this.signUpWithEmail = this.signUpWithEmail.bind(this);
		this.handleEmailChange = this.handleEmailChange.bind(this);
		this.handlePasswordChange = this.handlePasswordChange.bind(this);
		this.continueToVerifyPage = this.continueToVerifyPage.bind(this);
	}
	signUpWithFacebook(){
		this.signUp(new this.state.firebase.auth.FacebookAuthProvider())
	}
	signUpWithGoogle(){
		this.signUp(new this.state.firebase.auth.GoogleAuthProvider())
	}
	continueToVerifyPage(){
		let email = this.state.emailInput;
		window.location.href = "waitingVerification.html?email=" + email;
	}
	signUpWithEmail(){
		this.state.firebase.auth().createUserWithEmailAndPassword(this.state.emailInput, this.state.passwordInput)
		.then((user)=>{
			this.state.firebaseUtils.newProviderUser(user);
			this.state.firebase.auth().onAuthStateChanged(user=>{
				this.state.firebase.auth().currentUser.sendEmailVerification({url:'https://calderwhite.github.io/medium-analytics/login'})
				.then(this.continueToVerifyPage)
			})
		})
		.catch((error) =>{
		alert("Error signing up with email!")
		// Handle Errors here.
		var errorCode = error.code;
		var errorMessage = error.message;
		// ...
		console.log(errorCode,errorMessage)
		});
	}
	signUp(provider){
		var t = this;
		this.state.firebase.auth().signInWithPopup(provider).then((result) =>{
			t.state.firebaseUtils.newProviderUser(result.user,()=>{
				this.props.continueToNextPage()
			}),
			()=>{
				alert("There was an error signing in!")
			}
		})
	}
	handleEmailChange(event){
		this.setState({
			emailInput:event.target.value
		});
	}
	handlePasswordChange(event){
		this.setState({
			passwordInput:event.target.value
		});
	}
	render(){
		return (
			<div style={{textAlign:'center'}}>
				<div style={{display:'inline-block', marginTop:'7%', paddingTop:20, paddingBottom:20,paddingLeft:10,paddingRight:10}} className="card">
					<p>Remember to use the service which you signed up for Medium with!</p>
					<div>
						<GoogleButton onClick={this.signUpWithGoogle} />
						<FaceBookButton onClick={this.signUpWithFacebook} />
					</div>
					<p style={{float:'clear', display:'inline-block'}}>
						<i style={{fontSize:24, fontWeight:300}}>or </i>
						input the email you used and choose a password. <br />
						<b>Note!</b> If you use this method, an email verification is required.
					</p>
					<div style={{margin:'5%', marginTop:0,width:'90%'}}>
						<input onChange={this.handleEmailChange} type="text" className="form-control" id="formGroupExampleInput" placeholder="Enter the email you used for Medium" />
						<input onChange={this.handlePasswordChange} style={{marginTop:15}} type="password" className="form-control" id="inputPassword" placeholder="Enter an original password" />
						<button onClick={this.signUpWithEmail} style={{marginTop:15}} type="button" className="btn btn-primary btn-lg btn-block">Sign Up</button>
					</div>
				</div>
			</div>
		)
	}
}