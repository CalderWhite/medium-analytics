import React, {Component} from "react";
import "../../../css/app/signInButtons.css";

// didn't have time to get facebook's code generator working to my needs, so this
// component is essentially copied from html generated from the facebook SDK

export default class FaceBookButton extends Component{
	constructor(props){
		super(props);
	}
	render(){
		let cn = this.props.className ? this.props.className : "";
		return(
			<div className="social-button">
				<div className={"_li" + cn} onClick={this.props.onClick} style={this.props.style}>
				   <div className="pluginSkinLight pluginFontHelvetica">
				      <div className="pluginLoginButton pluginLoginButtonlarge" id="u_0_0" style={{width:253}}>
				         <div>
				            <div className="_xvm _29o8" id="u_0_1">
				               <div className="_5h0c _5h0d" style={{}} role="button" tabIndex="0">
				                  <table className="uiGrid _51mz _5h0i _5f0n" cellSpacing="0" cellPadding="0">
				                     <tbody>
				                        <tr className="_51mx">
				                           <td className="_51m-">
				                              <div className="_5h0j">
				                                 <span className="_5h0k">
				                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 216 216" className="_5h0m" color="#ffffff">
				                                       <path fill="#ffffff" d="M204.1 0H11.9C5.3 0 0 5.3 0 11.9v192.2c0 6.6 5.3 11.9 11.9 11.9h103.5v-83.6H87.2V99.8h28.1v-24c0-27.9 17-43.1 41.9-43.1 11.9 0 22.2.9 25.2 1.3v29.2h-17.3c-13.5 0-16.2 6.4-16.2 15.9v20.8h32.3l-4.2 32.6h-28V216h55c6.6 0 11.9-5.3 11.9-11.9V11.9C216 5.3 210.7 0 204.1 0z"></path>
				                                    </svg>
				                                 </span>
				                              </div>
				                           </td>
				                           <td className="_51m- _51mw">
				                              <div className="_5h0s">
				                                 <div className="_5h0o">Continue with Facebook</div>
				                              </div>
				                           </td>
				                        </tr>
				                     </tbody>
				                  </table>
				               </div>
				            </div>
				         </div>
				      </div>
				   </div>
				</div>
			</div>
		)
	}
}