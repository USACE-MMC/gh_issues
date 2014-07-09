
var getParam = function(key){
	var queryString = window.location.search.substring(1);
	var params = queryString.split('&');
	for(var i = 0;i < params.length;i++){
		var pair = params[i].split('=');
		if(pair[0] == key){
			return pair[1];
		}
	}
	return -1;
}

var settings = {
	accessToken:getParam('access_token'),
	owner:getParam('owner'),
	repo:getParam('repo'),
	apiUrl:'https://api.github.com/repos/',
	fullUrl:function(){
		return this.apiUrl + this.owner + '/' + this.repo
	}
}

var Issues = [];


var renderIssues = function(){
	$.each(Issues,function(i,v){
		$('body').append('<div id="issue-'+ v.number +'" class="issue"></div>');
		$('#issue-'+ v.number).append('<div class="issue-title">'+ v.number+ ' (' + v.state + '): ' + v.title + '</div>');
		$('#issue-'+ v.number).append('<div class="issue-author">@'+ v.user.login + ' added the issue on ' + v.created_at + '</div>');
		$('#issue-'+ v.number).append(v.body_html);
		$('#issue-'+ v.number).append('<div class="comments-list"></div>');
	});
};

var renderComments = function(comments,no){
	if(typeof(comments) === 'object'){
		var d = '#issue-'+ no +' .comments-list'
		$.each(comments,function(i,v){
			$(d).append('<div class="comment-header">@'+v.user.login+' commented on ' + v.created_at + '</div>');
			$(d).append('<div class="comment">'+v.body_html+'</div>');
		});
	}
}

$( document ).ready(function() {
	$('body').append('<div id="title-block" class="h2">Issue/Task Summary for the ' + settings.owner + '/' + settings.repo + ' repository</div>');
	
  var getIssues = function(callback){
		$.ajax({
		  url:settings.fullUrl() + '/issues',
		  headers:{
			Accept:'application/vnd.github.full+json'
		  },
		  data:{
			access_token:settings.accessToken,
			state:'all'
		  },
		  success:function(data){
			Issues = data;
			$.each(Issues,function(i,v){
				getIssueComments(v.number,i);
			});
			callback();
		  }
		});
	};

  var getIssueComments = function(issueNo, i){
	$.ajax({
		  url:settings.fullUrl() + '/issues/' + issueNo + '/comments',
		  headers:{
			Accept:'application/vnd.github.full+json'
		  },
		  data:{
			access_token:settings.accessToken
		  },
		  success:function(data){
			Issues[i].comments = data;
			renderComments(Issues[i].comments,Issues[i].number);
		  }
	  });
	};

  getIssues(renderIssues);
  
});























