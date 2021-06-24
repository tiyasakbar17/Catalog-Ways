import React from 'react'
import { connect } from 'react-redux';
import { showPopUp } from '../../redux/actions/PopUp'


function PopUps({ PopUpState, showPopUp }) {
    const { message } = PopUpState

    const clickHandler = () => {
        // CLOSE POPUP
        showPopUp("")
    }

    return (
        <div className="popUpPage" >
            <div className="modalBackground" onClick={clickHandler}></div>
            <div className="popUpContainer">
                <div className="popUpCloser pointer" onClick={clickHandler}>
                    <i className="fas fa-times text-white"></i>
                </div>
                <span className="text-primary">{message}</span>
            </div>
        </div>
    )
}

const mapStateToProps = (state) => {
    return { PopUpState: state.PopUp }
}

export default connect(mapStateToProps, { showPopUp })(PopUps);
