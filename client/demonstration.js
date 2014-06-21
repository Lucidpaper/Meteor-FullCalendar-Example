CalEvents = new Meteor.Collection('calevents');
Session.setDefault('editing_calevent', null);
Session.setDefault('showEditEvent', false);
Session.setDefault('lastMod', null);
Meteor.Router.add({
	'/':'homepage',
	'/calendar':'calendar'	
})

Template.calendar.showEditEvent = function(){
	return Session.get('showEditEvent');
}
Template.editEvent.evt = function(){
	var calEvent = CalEvents.findOne({_id:Session.get('editing_calevent')});
	return calEvent
}
Template.calendar.lastMod = function(){
	return Session.get('lastMod');
}
Template.editEvent.events({
	'click .save':function(evt,tmpl){
		updateCalEvent(Session.get('editing_calevent'),tmpl.find('.title').value);
		Session.set('editing_event',null);
		Session.set('showEditEvent',false);
		Session.set('lastMod',new Date());
	}
})
Template.calendar.rendered = function(){
	$('#calendar').fullCalendar({
			dayClick:function( date, allDay, jsEvent, view ) {
				CalEvents.insert({title:'New Event',start:date,end:date});
				Session.set('lastMod',new Date());
			},
			eventClick:function(calEvent,jsEvent,view){
				Session.set('editing_calevent',calEvent.id);
				Session.set('showEditEvent',true);
				
			},
			eventDrop:function(calEvent){
				CalEvents.update(calEvent.id, {$set: {start:calEvent.start,end:calEvent.end}});
				Session.set('lastMod',new Date());
			},
			events: function(start, end, callback) {
		     	var events = [];
				calEvents = CalEvents.find();
				calEvents.forEach(function(evt){
					events.push({id:evt._id,title:evt.title,start:evt.start,end:evt.end});
					
				})
				callback(events);
			},
			editable:true
		});
}

var updateCalEvent = function(id,title){
	CalEvents.update(id, {$set: {title:title}});
	return true;
}