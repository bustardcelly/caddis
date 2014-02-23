Feature: Add of GET request
  As a User of Caddis
  I want to add a GET request with return data
  So I can mock a service call

  Background: Caddis Started
    Given The Caddis server has started

  Scenario: GET request exposed at uri
    When I submit a GET request with response JSON
    Then The JSON is returned by issuing a GET at the specified uri