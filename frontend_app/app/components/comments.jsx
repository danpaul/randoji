var _ = require('underscore');

var SERVER_ERROR_MESSAGE = 'A server error occurred.';

module.exports = React.createClass({

    addComment: function(parentId, comment){

        var self = this;
        var url = self.props.endpoint + '/comment/' + self.props.placeId +
                  '/' + parentId;

        $.ajax({
            type: "POST",
            'url': url,
            data: {
                'comment': comment
            },
            success: function(response){
                if( response.status !== 'success' ){
                    self.triggerNotice(response.errorMessage);
                } else {
                    self.setState({hasLoaded: false});
                    self.loadComments(self.props.placeId);
                }
            },
            error: function(err){
                console.log(err);
                self.triggerNotice(SERVER_ERROR_MESSAGE);
            },
            dataType: 'JSON'
        });
    },

    handleFlag: function(commentId){

        var self = this;
        var url = self.props.endpoint + '/flag/' + commentId;

        $.ajax({
            type: "POST",
            'url': url,
            success: function(response){
                if( response.status !== 'success' ){
                    self.triggerNotice(response.errorMessage);
                } else {
                    self.triggerNotice('Comment Flagged');
                }
            },
            error: function(err){
                self.triggerNotice(SERVER_ERROR_MESSAGE);
            },
            dataType: 'JSON'
        });

    },
    handleVote: function(direction, commentId){

        var self = this;
        var url = self.props.endpoint + '/comment/vote/' + direction +
                        '/' + commentId;

        $.ajax({
            type: "POST",
            'url': url,
            success: function(response){
                if( response.status !== 'success' ){
                    self.triggerNotice(response.errorMessage);
                } else {
                    self.triggerNotice('Vote Added');
                }
            },
            error: function(err){
                self.triggerNotice(SERVER_ERROR_MESSAGE);
            },
            dataType: 'JSON'
        });

    },
    cleanComments: function(comments){
        var self = this;
        _.each(comments, function(comment){
            comment.addComment = self.addComment;
            comment.handleVote = self.handleVote;
            comment.handleFlag = self.handleFlag;
            if( comment.children.length !== 0 ){
                self.cleanComments(comment.children);
            }
        })
    },

    componentDidMount: function(){
        this.loadComments(this.props.placeId);
    },

    componentWillReceiveProps: function(nextProps){
        if( nextProps.placeId !== this.props.placeId ){
            this.loadComments(nextProps.placeId);
            this.setState({hasLoaded: false});
        }
    },

    getInitialState: function(){
        return({ hasLoaded: false, comments: [] , notice: null});
    },

    triggerNotice: function(message){
        var self = this;
        var noticeElement =
            <div
                style={{
                    position: 'fixed',
                    top: '10px',
                    right: '10px'
                }}
                className={"alert-box alert"} >
                {message}
            </div>;

        self.setState({notice: noticeElement}, function(){
            setTimeout(function(){
                self.setState({notice: null});
            }, 2000)
        });
    },

    loadComments: function(placeId){
        var self = this;

        $.ajax({
            type: "GET",
            url: self.props.endpoint + '/comments-formatted/' + placeId,
            success: function(response){
                if( response.status !== 'success' ){
                    console.log(response);
                    self.triggerNotice(response.errorMessage);
                } else {
                    self.cleanComments(response.data);
                    self.setState(
                        {'comments': response.data, hasLoaded: true}
                    );
                }
            },
            error: function(err){
                console.log(err);
                self.triggerNotice(SERVER_ERROR_MESSAGE);
            },
            dataType: 'JSON'
        });
    },
    render: function(){
        var self = this;

        var addPlaceButtonClasses = 'js-add-place button expand';

        if(!this.state.hasLoaded){
            return(null);
        } else {
            return(
                <div>
                    {self.state.notice}
                    < Comment 
                        children={[]}
                        isTopLevel={true}
                        addComment={this.addComment} />
                    <Comments comments={this.state.comments} />
                </div>);
        }
    },
    updatePlaceValue: function(event){
        this.setState({placeValue: event.target.value});
    }
});

var Comments = React.createClass({
    render: function(){
        var self = this;

        var comments = this.props.comments.map(function(comment, index){

            var isOpen = false;
            if( comment.comment === null ){ isOpen = true; }
            var commentChildren = '';
            if( comment.children.length !== 0 ){
                commentChildren = <Comments comments={comment.children} />;
            }
            return(
                < Comment 
                    addComment={comment.addComment}
                    children={comment.children}
                    childrenElement={commentChildren}
                    parent={comment.id}
                    comment={comment.comment}                    
                    created={comment.created}
                    handleVote={comment.handleVote}
                    handleFlag={comment.handleFlag}
                    id={comment.id}
                    isTopLevel={false}
                    key={index}
                    rank={comment.rank} />
            );
        });

        return(<div>{comments}</div>);
    },
    updateComment: function(event){
        this.setState({comment: event.target.value});
    }
})

var Comment = React.createClass({

    getInitialState: function(){
        return({
            comment: '',
            showCommentForm: false,
            showControls: false,
            showChildren: true});
    },
    handleCancel: function(){
        this.setState({showCommentForm: false});
    },

    handleSubmit: function(event){
        event.preventDefault();
        event.stopPropagation();
        this.props.addComment(this.props.parent, this.state.comment);
    },

    handleShowControl: function(){
        this.setState({showControls: !this.state.showControls});
    },
    // handleSubmit: function(){
    //     event.preventDefault();
    //     this.props.addComment(this.props.id, this.state.comment);
    // },
    handleToggleChilren: function(){
        var nextState = !this.state.showChildren;
        this.setState({
            showChildren: nextState, showControls: false});
    },
    handleToggleCommentForm: function(){
        var nextState = !this.state.showCommentForm;
        this.setState({showCommentForm: nextState});
    },

    handleUpvote: function(){
        this.props.handleVote('up', this.props.id);
    },

    handleFlag: function(){
        this.props.handleFlag(this.props.id);
    },

    handleDownvote: function(){
        this.props.handleVote('down', this.props.id);
    },

    render: function(){

        var self = this;

        var commentFormStyle = this.state.showCommentForm &&
                               this.state.showControls ?
                                    {display: 'block', marginTop: '10px'} :
                                    {display: 'none'};

        if( self.props.isTopLevel ){
            commentFormStyle = {display: 'block', marginTop: '10px'};
        }

        var toggleCharacter = self.state.showChildren ? '-' : '+';
        var childContainerStyle = self.state.showChildren ?
                {display: 'block'} : {display: 'none'};
        var toggleButtonStle = (self.props.children.length === 0) ?
                                    {display: 'none'} : {display: 'block'};
        var commentRank = self.props.rank ? self.props.rank : 0;

        var createdDate = new Date(self.props.created * 1000).toString();
        var hasChildren = this.props.children.length > 0;

        return(
            <div
                className="sql-comment-container"
                style={{marginTop: '10px'}} >

                <div
                    className="sql-comment-comment-meta"
                    style={ self.props.isTopLevel ?
                        {display: 'none'} : {marginTop: '10px'}}
                >
                    <span className="sql-comment-username">
                        danpaul
                    </span> - 
                    <span className="sql-comment-date">
                        &nbsp;{createdDate}
                    </span> - 
                    <span style={{
                        marginLeft: '3px',
                        position: 'relative',
                        top: '1px'

                    }}>
                        {commentRank}
                    </span>
                </div>
                <div
                    style={{cursor: 'pointer'}}
                    onClick={self.handleShowControl}
                >
                    {this.props.comment}
                </div>
                <div style={ this.state.showControls ?
                                {display: 'block'} : {display: 'none'}} >

                </div>
                <div style={ this.state.showControls ?
                                {display: 'block'} : {display: 'none'}}>

                    <a onClick={this.handleUpvote}>
                        <i className="fi-arrow-up"></i>
                    </a>&nbsp;&nbsp;
                    <a onClick={this.handleDownvote}>
                        <i className="fi-arrow-down"></i>
                    </a>&nbsp;&nbsp;
                    <a onClick={this.handleFlag}>
                        <i className="fi-flag"></i>
                    </a>&nbsp;&nbsp;
                    <a onClick={this.handleToggleCommentForm}>
                        <i className="fi-comment"></i>
                    </a>
                    <span style={ hasChildren ?
                        {display: 'inline'} : {display: 'none'}}>

                        &nbsp;&nbsp;
                        <a onClick={this.handleToggleChilren}>
                            { this.state.showChildren ?
                                <i className="fi-arrows-compress"></i> :
                                <i className="fi-arrows-expand"></i> }
                        </a>
                    </span>
                </div>

                <div style={commentFormStyle}>
                    <textarea
                        placeholder="Add Comment"
                        onChange={self.updateComment}
                        value={self.state.comment} />
                    <button
                        href="javascript:null;"
                        className={"button small"}
                        onClick={self.handleSubmit}
                    >Submit</button>
                    <button
                        href="javascript:null;"
                        className={"button small inverted left-padded"}
                        onClick={self.handleCancel}
                    >Cancel</button>
                </div>

                <div style={childContainerStyle}>
                    {this.props.childrenElement}
                </div>
            </div>
        )
    },
    updateComment: function(event){
        this.setState({comment: event.target.value});
    }
});
