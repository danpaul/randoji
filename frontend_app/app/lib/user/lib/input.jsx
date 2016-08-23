module.exports = React.createClass({

    getInitialState: function(){
        return {value: ''}
    },
    getInputValue: function(){
        return this.state.value
    },
    handleChange: function(event){
        this.setState({value: event.target.value})
    },
    render: function(){
        return(
            <div>
                <label>{this.props.label}</label>
                <input
                    type={this.props.type}
                    name={this.props.name}
                    ref={this.props.ref}
                    value={this.state.value}
                    onChange={this.handleChange}
                ></input>
            </div>
        )
    }
})