// Make Velocity globals available in this package
var packageContext = this;
_.forEach(Package['velocity:core'], function (globalValue, globalName) {
  packageContext[globalName] = globalValue;
});

Session.setDefault('overlayWidth', 'normal-width');
Session.setDefault('velocityPanelSize', 'closed');
Session.setDefault('lastPanelSize', 'normal');

//Session.set('overlayWidth', 'wide-width');

Template.velocity.created = function () {
  // Only show widget when we know we are NOT running in a Velocity Mirror
  Session.setDefault('velocity.isMirror', true);

  // Determine if user has disabled velocity
  Meteor.call('velocity/isEnabled', function(error, result){
    Session.set('velocity.isEnabled', result);
  });

  // Determine if session is running in a Velocity mirror or not
  Meteor.call('velocity/isMirror', function (err, res) {
    if (err) {
      // Log error. HTML Reporter will not be shown
      console.error(err);
    } else {
      Session.set('velocity.isMirror', res);
    }
  })
};

Template.velocity.helpers({
  gripLocation: function () {
    if(Session.equals('velocityPanelSize', 'closed')){
      return "grip-location-closed";
    }else if(Session.equals('velocityPanelSize', 'normal')){
      return "grip-location-normal";
    }else if(Session.equals('velocityPanelSize', 'wide')){
      return "grip-location-wide";
    }
  },
  panelWidth: function () {
    if(Session.equals('velocityPanelSize', 'closed')){
      return "panel-width-closed";
    }else if(Session.equals('velocityPanelSize', 'normal')){
      return "panel-width-normal";
    }else if(Session.equals('velocityPanelSize', 'wide')){
      return "panel-width-wide";
    }
  },
  statusWidgetClass: function () {
    var aggregateResult = VelocityAggregateReports.findOne({name: 'aggregateResult'});
    if (aggregateResult && aggregateResult.result === 'failed') {
      return  'failed';
    }

    var aggregateComplete = VelocityAggregateReports.findOne({name: 'aggregateComplete'});
    if (aggregateComplete && aggregateResult
      && aggregateResult.result === 'passed' && aggregateComplete.result === 'completed') {
      return 'passed';
    }
    return 'pending';
  },
  resetting: function () {
    return Session.get('resettingVelocity')
  },
  testReports: function () {
    return VelocityTestReports.find();
  },
  frameworks: function () {
    return VelocityAggregateReports.find({name: {$nin: ["aggregateResult", "aggregateComplete"]}});
  },
  active: function (id) {
    return reamplify.store(id);
  },
  overlayIsVisible: function () {
    return amplify.store('velocityOverlayIsVisible')
  },
  showVelocity: function () {
    // This causes the html reporter to remain hidden if running in a Velocity mirror
    return Session.equals('velocity.isEnabled', true) && Session.equals('velocity.isMirror', false);
  },


  anyFailed: function () {
    var aggregateResult = VelocityAggregateReports.findOne({name: 'aggregateResult'})
    if (aggregateResult && aggregateResult.result === 'failed') {
      return  true;
    }
    return false;
  },
  // totalTime: function () {
  //   var results = VelocityTestReports.find().fetch();
  //
  //   var firstTimeStamp, lastTimestamp, lastDuration;
  //   _.each(results, function (result) {
  //     if (!firstTimeStamp ||  firstTimeStamp > result.timestamp.getTime()) {
  //       firstTimeStamp = result.timestamp.getTime();
  //     }
  //     if (!lastTimestamp ||  lastTimestamp < result.timestamp.getTime()) {
  //       lastTimestamp = result.timestamp.getTime();
  //       lastDuration = result.duration;
  //     }
  //   });
  //   var ms = lastTimestamp + lastDuration - firstTimeStamp;
  //
  //   if (ms >= 1000) return Math.round(ms / 1000) + ' s';
  //
  //   return ms?ms:0 + ' ms';
  // },

  totalFailedTestCount: function () {
    return VelocityTestReports.find({result: 'failed'}).count();
  },
  totalTestCount: function () {
    return VelocityTestReports.find().count();
  },
  totalPassedTestCount: function () {
    return VelocityTestReports.find({result: 'passed'}).count();
  },
});


//==================================================================================
// Summary, Control Panel



Template.velocityControlPanel.helpers({
  showActive: function (id) {
    // XXX refactor this to name consistently
    return !reamplify.store(id) ? '' : 'active';
  },
  showActive: function (self) {
    // $self = $("#"+ self);
    return reamplify.store(self) ? 'active' : ''
  }
});

Template.velocityControlPanel.events({
  'click #resetAll': function (attribute) {
    Meteor.call("velocity/reports/reset");
    Session.set('isLaunching', false);
  },
  'click #runNightwatchTests': function () {
    console.log('#runNightwatchTests clicked.');
    Session.set('isLaunching', true);
    Meteor.call("velocity/logs/reset", {framework: "nightwatch"}, function(error, result){
      Meteor.call('nightwatch/run/reporter', function(error, result){
        if(result){
          Session.set('isLaunching', false);
          Meteor.call("velocity/reports/completed");
          Meteor.call('nightwatch/parse/xml');
        }
      });
    });
  }
});
Template.velocity.events({
  'click #overlayResizeGrip':function(){
    //alert('foo!')
    // if(Session.equals('overlayWidth', 'normal-width')){
    //   Session.set('overlayWidth', 'wide-width');
    // }else{
    //   Session.set('overlayWidth', 'normal-width');
    // }
    if(Session.equals('velocityPanelSize', 'normal')){
      Session.set('velocityPanelSize', 'wide');
      Session.set("lastPanelSize", 'wide');
    }else if(Session.equals('velocityPanelSize', 'wide')){
      Session.set('velocityPanelSize', 'normal');
      Session.set("lastPanelSize", 'normal');
    }
  },
  'click .display-toggle': function (e) {
    if(Session.equals('velocityPanelSize', 'closed')){
      Session.set('velocityPanelSize', Session.get('lastPanelSize'));
    }else if(Session.equals('velocityPanelSize', 'normal')){
      Session.set('velocityPanelSize', 'closed');
    }else if(Session.equals('velocityPanelSize', 'wide')){
      Session.set('velocityPanelSize', 'closed');
    }

    //
    //
    //
    // var targetId = $(e.currentTarget).data('target'),
    //     $target = $('#' + targetId);
    // $target.toggleClass('visible');
    // if($target.hasClass('visible')){
    //   $("#overlayResizeGrip").addClass('grip-visible');
    // }else{
    //   $("#overlayResizeGrip").removeClass('grip-visible');
    // }
    //
    // // $('#velocityOverlay').toggleClass('visible');
    // amplify.store(targetId + 'IsVisible', $target.hasClass('visible') );
  },
  'change input:checkbox': function (e) {
    var targetId = e.target.id
    reamplify.store(e.target.id, e.target.checked);
  },
  'click button.control-toggle': function (e) {
    var $target = $('#' + e.target.id);
    $target.toggleClass('active');
    reamplify.store(e.target.id, $target.hasClass('active'));
  },
  'click .velocity-options-toggle': function (e, tpl) {
    tpl.$('.velocity-options').toggleClass('visible')
  }
});


//==================================================================================
// Helpers


suiteHasFailed = function (suite) {
  return !!VelocityTestReports.findOne({
    framework: suite.framework,
    ancestors: suite.ancestors,
    result: "failed"
  });
};

frameworkStatus = function (name) {
  var hasTests = VelocityTestReports.find({framework: name}).count() > 0;
  if (!hasTests) return "empty"

  var frameworkExecStatus = VelocityAggregateReports.findOne({name: name});
  var isComplete = (frameworkExecStatus && frameworkExecStatus.result === "completed");
  var hasFailed = !! VelocityTestReports.findOne({framework: name, result: "failed"});

  if (hasFailed)
    return "failed";
  else if (isComplete)
    return "passed";
  else
    return "pending";
}



Template.registerHelper("regularPlural", function(count, word, suffix){
  if(count === 1) return word;
  return word + suffix;
});


Template.registerHelper("mochaPresent", function(argument){
  return !! VelocityAggregateReports.findOne({'name': 'mocha'});
});

Template.registerHelper("nightwatchPresent", function(argument){
  return !! VelocityAggregateReports.findOne({'name': 'nightwatch'});
});
