Package.describe({
  name: 'velocity:nightwatch-reporter',
  summary: 'Nightwatch specific HTML reporter for Velocity.',
  version: '0.4.2',
  git: 'https://github.com/meteor-velocity/html-reporter.git',
  debugOnly: true
});

Package.onUse(function(api) {
  api.versionsFrom('METEOR@1.0');
  api.use('velocity:core@0.4.5', 'client');

  api.use(['underscore', 'session', 'templating','amplify@1.0.0', 'less'], 'client');

  api.addFiles('components/reamplify.js', 'client');

  api.addFiles('components/velocityWidget/velocityWidget.html', 'client');
  api.addFiles('components/velocityWidget/velocityWidget.js', 'client');
  api.addFiles('components/velocityWidget/velocityWidget.less', 'client');

  api.addFiles('components/velocityReports/velocityReports.html', 'client');
  api.addFiles('components/velocityReports/velocityReports.js', 'client');
  api.addFiles('components/velocityReports/velocityReports.less', 'client');

  api.addFiles('components/status-widget.less', 'client');

  api.addFiles('assets/velocity_logo.svg');
  api.addFiles('assets/velocity_cog.svg');
  api.addFiles('assets/icon-time.png');

  // api.export('reamplify', ['client']);
});
