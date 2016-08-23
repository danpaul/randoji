/**
* should pass properites:
*   visible: true/false
*   handleClose: function, should set the Modal's visible property to ralse
*   optionally can take size: small, medium, large
*/
module.exports = React.createClass({
    render: function(){
        var containerStyles = {
            position: 'absolute',
            width: '100%',
            height: '100%',
            top: 0,
            left: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            zIndex: 100
        }

        var modalHeight = 0.92 * window.innerHeight;

        var modalStyle = {
            margin: '0 auto',
            marginTop: '20px',
            backgroundColor: '#FFF',
            padding: '20px',
            boxShadow: '0 0 25px #444444',
            overflow: 'scroll',
            maxHeight: modalHeight
        }

        var closeButtonContainerStyle = {
            marginTop: '-20px',
            marginLeft: '-10px',
            width: '100%'
        }

        var closeButtonStyle = {
            color: '#000',
            fontWeight: 100,
            fontSize: '30px',
            cursor: 'pointer',
            top: '20px',
            left: '20px'

        }

        var modalSize = this.props.size ? this.props.size : 'small';
        var modalClasses = '';
        if( modalSize === 'small' ){
            modalClasses = 'small-12 medium-8 large-6';
        } else if( modalSize === 'medium' ){
            modalClasses = 'small-12 medium-10 large-8';
        } else {
            modalClasses = 'small-12 medium-10';
        }

        if( !this.props.visible ){
            containerStyles.display = 'none';
        }

        return(
            <div style={containerStyles}>
                <div className="row">
                    <div style={modalStyle} className={modalClasses}>
                        <div style={closeButtonContainerStyle}>
                            <div
                                style={closeButtonStyle}
                                onClick={this.props.handleClose}
                            >X</div>
                        </div>
                        {this.props.children}
                    </div>
                </div>
            </div>
        );
    }
});