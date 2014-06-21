CalEvents = new Meteor.Collection('calevents');
Meteor.methods({
	'removeAll':function(){
		CalEvents.remove({});
	}
})