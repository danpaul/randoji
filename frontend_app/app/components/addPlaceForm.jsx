var services = require('../lib/services.js');
var geoLit = require('../lib/geo_lit.js');

var Modal = require('../lib/user/lib/modal.jsx');
var Alert = require('../lib/user/lib/alert.jsx');

var ERROR_TITLE_TOO_SHORT = 'Place title is not long enough.';

var BUTTON_STYLE = {
    position: 'absolute',
    top: '5px',
    left: '5px'
}

module.exports = React.createClass({

    validation: {
        minPlaceLength: 4
    },

    addPlace: function(event){
        var self = this;
        event.preventDefault();

        var placeTitle = this.state.placeValue;
        var placeTitleValidation = this.validatePlace(placeTitle);

        if( placeTitleValidation !== true ){
            self.setState({errorMessage: placeTitleValidation});
            return;
        }

        geoLit.addPlace(this.state.placeValue, function(errorMessage, place){

            if( errorMessage ){
                self.setState({'errorMessage': errorMessage});
            } else {
                if( self.props.addPlaceCallback ){
                    self.setState({
                            errorMessage: '',
                            placeValue: '',
                            modalVisible: false}, function(){

                        if( self.props.addPlaceCallback ){
                            self.props.addPlaceCallback(place);
                        }
                    });
                }
            }
        })
    },

    getInitialState: function(){
        return({ placeValue: '', errorMessage: '', modalVisible: false});
    },

    handleModalClose: function(){
        this.setState({modalVisible: false});
    },

    handleShowFormClick: function(e){
        this.setState({modalVisible: true});
    },

    // returns true if valid, else string error message
    validatePlace: function(placeTitle){
        if( placeTitle.trim().length < this.validation.minPlaceLength ){
            return ERROR_TITLE_TOO_SHORT;
        }
        return true;
    },

    render: function(){
        var self = this;
        var addPlaceButtonClasses = 'js-add-place button expand';

        if( self.props.activeComponent !== '' )

        return(
            <div>
                <button
                    className={"sql-login-button button tiny"}
                    style={BUTTON_STYLE}
                    onClick={this.handleShowFormClick} >
                    Add Place
                </button>
                <Modal
                    visible={this.state.modalVisible}
                    handleClose={this.handleModalClose}>
                    <Alert message={this.state.errorMessage} />
                    <form>
                        <div className="row">
                            <div className="small-12 columns">
                                <input
                                    type="text"
                                    name="title"
                                    placeholder="Title"
                                    value={this.state.placeValue}
                                    onChange={this.updatePlaceValue} />
                                <a
                                    href="javascript:void(0)"
                                    onClick={this.addPlace}
                                    className={addPlaceButtonClasses}
                                >
                                    Add Place
                                </a>
                            </div>
                        </div>
                    </form>
                </Modal>
            </div>
        );
    },

    updatePlaceValue: function(event){
        this.setState({placeValue: event.target.value});
    }

});