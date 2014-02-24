Feature: Add of POST request
  As a User of Caddis
  I want to add a POST request with return data
  So I can mock a service call

  Background: Caddis Started
    Given The Caddis server has started

  Scenario: GET request exposed at uri
    When I submit a "POST" request with response JSON:
    """
    {
      "method": "post",
      "uri": "/user/:id",
      "response": {
        "result": true
      }
    }
    """
    Then The JSON is returned by issuing a "POST" at the specified uri:
    """
    {
      "result": true
    }
    """