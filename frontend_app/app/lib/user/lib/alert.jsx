/**
* Takes property `message`, will display message if not empty
* Optionally takes styles (object)
*/
module.exports = React.createClass({
    defaultStyles: {
    },
    render: function(){

        if( this.props.message === "" ){ return null; }

        var styles = this.props.styles ? this.props.styles : this.defaultStyles;

        return(
            <div className={"alert-box alert"} style={styles}>
                {this.props.message}
            </div>
        );
    }
});