Feature: Caddis supports query params
  As a user of Caddis
  I want to mock a REST request that has optional query params for filters

  Background: Caddis Started
    Given The Caddis server has started

  Scenario: Query params are tokenized and accepted with exact values
    When I submit a "GET" request with response JSON:
    """
    {
      "method": "get",
      "uri": "/user?category=employee&age=37&apartment=security",
      "response": {
        "name": "foo"
      }
    }
    """
    And I follow-up a GET request to caddis at "http://localhost:3001/user?category=employee&age=37&apartment=security"
    Then The response from the follow-up is:
    """
    {"name":"foo"}
    """

  Scenario: Query params are tokenized and accepted with different values
    When I submit a "GET" request with response JSON:
    """
    {
      "method": "get",
      "uri": "/user?category=employee&age=37&apartment=security",
      "response": {
        "name": "foo"
      }
    }
    """
    And I follow-up a GET request to caddis at "http://localhost:3001/user?category=student&age=14&apartment=english"
    Then The response from the follow-up is:
    """
    {"name":"foo"}
    """

  Scenario: Query params are tokenized and accepted with special characters
    When I submit a "GET" request with response JSON:
    """
    {
      "method": "get",
      "uri": "/user?category=employee&age=37&apartment=security",
      "response": {
        "name": "foo"
      }
    }
    """
    And I follow-up a GET request to caddis at "http://localhost:3001/user?category=0.45&age=-45&apartment=the%20class"
    Then The response from the follow-up is:
    """
    {"name":"foo"}
    """