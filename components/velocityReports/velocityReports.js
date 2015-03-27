Session.setDefault('isLaunching', false);



Template.velocityReports.helpers({
  isLaunchingFramework: function () {
    return Session.get('isLaunching');
  },
  frameworkStatus: function () {
    return frameworkStatus(this.name)
  },
  isPassed: function (status) {
    return status === 'passed'
  },
  frameworkTotalTestCount: function () {
    return VelocityTestReports.find({framework: this.name}).count();
  },
  frameworkPassedTestCount: function () {
    return VelocityTestReports.find({framework: this.name, result: 'passed'}).count();
  },
  noFrameworkFiles: function () {
    // XXX presence of VelocityAggregateReports is a stand-in for
    // Velocity being loaded. This is a bit brittle. It breaks
    // if you call the Velocity "reset" method.
    var velocityIsLoaded = !! VelocityAggregateReports;
    return  ! velocityIsLoaded ?  false : ! VelocityTestFiles.findOne({targetFramework: this.name});
  },
  suites: function () {
    var result =  [];
    var reports = VelocityTestReports.find({framework: this.name}).fetch();
    // XXX for now, ancestors get reduced to a single-tier suite
    // Should we do fancier indenting, etc. for nested suites?
    // If not, forcing packages to concatenate their own "suite" string
    // instead of ancestors array would clean this up.
    if (reports.length > 0) {

      var reports = _.map(reports, function (report) {
        //must clone report.ancestors to not mutate report.ancestors with .reverse()
        var ancestors = report.ancestors ? _.clone(report.ancestors) : [];
        report.suite = ancestors.reverse().join(".");
        return report;
      });

      _.each(reports, function (report) {
        if (! _.findWhere(result, {suite: report.suite}))
          result.push({
            framework: report.framework,
            ancestors: report.ancestors, //needed for future queries
            suite: report.suite
          })
      });

      return result;
    }
  },
  suiteStatus: function () {
    return suiteHasFailed(this) ? 'failed' : 'passed';
  },
  suiteNotHidden: function () {
    if (!reamplify.store('showSuccessful'))
      return suiteHasFailed(this);
    return true;
  },
  reports: function () {
    return VelocityTestReports.find({
      framework: this.framework,
      ancestors: this.ancestors
    });
  },
  reportNotHidden: function () {
    if (this.result === "failed")
      return true;
    else{
      return (reamplify.store('showSuccessful'));
    }
  },
  failed: function () {
    return (this.result === "failed");
  },
  testResult: function () {
    return ((this.result === "passed") || (this.result === "failed"));
  },
  sectionBreak: function () {
    return (this.result === "sectionBreak");
  },
  sectionInfo: function () {
    return (this.result === "sectionInfo");
  },
  suiteInfo: function () {
    return (this.result === "suiteInfo");
  }
});




Template.velocityReports.events({
  'click .copy-sample-tests': function (e) {
    Meteor.call('velocity/copySampleTests', {framework: this.name}, function (err, res) {
      // XXX This method for getting the new files to register is slow, but it
      // works. The reset method gets Velocity to see the new files.
      // We then disconnect altogether to prevent flapping of reactive
      // template elements (& overlay a notification to show the user
      // what's happening). Then we simply reload. Is there a way to do this
      // with a lighter touch?

      // make sure the user can see the demo tests, which generally pass.
      reamplify.store('showSuccessful', true);
      Session.set('resettingVelocity', true)
      Meteor.call('velocity/reset');
      Meteor.disconnect();
      location.reload();
    });
  }
});




// Template.velocityTestReport.helpers({
//   reportNotHidden: function () {
//     if (this.result === "failed")
//       return true;
//     else{
//       return (reamplify.store('showSuccessful'));
//     }
//   },
//   failed: function () {
//     return (this.result === "failed");
//   }
// });



//====================================================================

Template.velocityTestFiles.helpers({
  testFiles: function () {
    return VelocityTestFiles.find();
  },
  isVisible: function () {
    return amplify.store('velocityTestFilesIsVisible') ? 'block' : 'none';
  }
});

Template.velocityLogs.helpers({
  logs: function () {
    return VelocityLogs.find();
  },
  isVisible: function () {
    return amplify.store('velocityLogsIsVisible') ? 'block' : 'none';
  }
});
