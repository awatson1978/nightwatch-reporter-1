nightwatch-reporter
======================

Nightwatch specific HTML reporter for use with the [velocity](http://velocity.meteor.com):[nightwatch-framework](https://github.com/meteor-velocity/nightwatch-framework).  Will eventually support Nightwatch specific features such as screenshot thumbnails.

======================
#### Installation

````sh
meteor add velocity:nightwatch-framework
meteor add velocity:nightwatch-reporter
````

======================
#### Usage
 
Simply run meteor as you normally would.

````
meteor
````
 
======================
#### User Interface  

A.  Add test files to your application by clicking on the ADD NIGHTWATCH SAMPLE TESTS button. 

![add-test-files](https://raw.githubusercontent.com/meteor-velocity/nightwatch-reporter/master/screenshots/add-test-files.jpg)

======================
B.  Click on the RUN TESTS button to start nightwatch.  It takes 15 to 30 seconds for Nightwatch to start.  Be patient.  If you'd like to follow along with what it's doing, watch your server console log.

![loading-screen](https://raw.githubusercontent.com/meteor-velocity/nightwatch-reporter/master/screenshots/loading-screen.jpg)

======================
C.  After your tests are run, you can scroll through to see which ones failed and when in the script it failed.  Click on RESET to simply reset the tests and run them again!

![test-passed](https://raw.githubusercontent.com/meteor-velocity/nightwatch-reporter/master/screenshots/tests-passed.png)



===============================
#### Licensing

MIT License. Use as you wish, including for commercial purposes.
