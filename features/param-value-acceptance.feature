Feature: URI Params accepts special characters
  As a user of Caddis
  I want to provide a uri parameter value that has special characters

  Background: Caddis Started
    Given The Caddis server has started

  Scenario: Param value with standard email is accepted
    When I submit a "GET" request with response JSON:
    """
    {
      "method": "get",
      "uri": "/user/:id",
      "response": {
        "name": "foo"
      }
    }
    """
    And I follow-up a GET request to caddis at "http://localhost:3001/user/test@test.com"
    Then The response from the follow-up is:
    """
    {"name":"foo"}
    """

  Scenario: Multiple param uris are accepted
    When I submit a "GET" request with response JSON:
    """
    {
      "method": "get",
      "uri": "/user/:id/group/:groupId",
      "response": {
        "employees": [
          {"user":"foo"}
        ]
      }
    }
    """
    And I follow-up a GET request to caddis at "http://localhost:3001/user/test@test.com/group/1234"
    Then The response from the follow-up is:
    """
    {"employees":[{"user":"foo"}]}
    """