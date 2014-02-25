Feature: User Profile Access
  As a User of NewCoolThing
  I want to log into NewCoolThing
  So I can access my profile

  @mock
  Scenario: User Log In Success
    Given I have valid user credentials
    When I submit my username and password
    Then I am returned my profile information