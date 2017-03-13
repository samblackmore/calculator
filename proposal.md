# Test Proposal
Testing of the calculator app can be divided into manual and automated testing. Manual testing covers `regression` and `exploratory` while automated testing covers `unit tests`, `integration tests` and `functional tests`.
### Unit Test
Using a framework like Mocha, developers should try to follow Test Driven Development (TDD) practises where a test is written before any implementation. Starting with a failing test, write and debug the function until it passes. We should aim for 100% coverage on all new commits and devote time to retro-actively writing unit tests for any parts of the codebase not already covered.
### Integration Test
Integration tests cover any function that combines multiple, smaller, unit-tested functions. For example, the calculator's solve function uses the `log` and `evaluate` functions to get a solution and render it to the DOM. While the individual functions need not know about each other, an integration test would check that the output of `evaluate` is in turn being `log`ged.
### Functional Test
Using a framework like Selenium Webdriver, UI tests carry out real-world flows that a user might try. A test will interact with the UI by pressing buttons and typing inputs, all the while validating the expected behavior. Examples:
  - If the user types one operator after another, the first will be replaced by the second on the calculator's display
  - If a solution is displayed on the calculator, pressing a number or bracket will clear the display but pressing an operator will append the operator to the solution

### Manual Testing
Using a tool like TestRail, create test suites for manual testing. A test suite is a checklist of multiple test cases that a tester can check off with different outcomes e.g. pass, fail, cannot test. If a test fails, the tester should assign a defect number to the test case. A tool like Rally or JIRA should be used to track defects.
Test suites should be written for all new features under development. A tester may write a test suite while the developer is coding the new feature and then the suite can be run during code review before merging the new feature.
A full sanity suite should be an exhaustive test suite that covers all the core features of the app. Regression testing is done at major intervals such as before a release or update where the full sanity is run and QA can feel confident that the release is stable.
Other types of manual testing include smoke testing - a quick, preliminary check of core features, soak testing - where the product is left for long time intervals to check for defects caused by memory leaks, for example, and exploratory testing - where a human tries to break the product in a way not easily thought of by a machine.

### Continuous Integration
Over time, the burden on manual QA should be gradually lifted as more and more scenarios can be automated. By integrating automated testing with the build process, a developer can known if they've broken something anywhere in the app without having to send a build to the QA team. Of course, the developer should manually test their code first before pushing their changes, but they aren't expected to catch every possible scenario.
A tool such as Github should be used to trigger the tests, for example on an opened pull request. A tool such as Jenkins can be used to run the tests and notify the outcome. UI tests can be run in a Docker container, allowing easy configuration of different environments for testing in different browsers, for example. Test results can be displayed in Jenkins with graphs of results over time, as well as a status added to the Github PR. A notification can be sent via email or instant message e.g. Slack API. This will require a build server and licenses for all tools. We can pick open source solutions wherever possible to minimize cost.
