Feature: Run Caddis as a node module
  As a user of Caddis
  I want to run the daemon from a node module
  So I can incorporate into node-based text frameworks

  Scenario: Caddis starts from module
    Given I have a reference to Caddis as a node module
    When I invoke start() with port "3002"
    And I visit "http://localhost:3002"
    Then I am returned a 200