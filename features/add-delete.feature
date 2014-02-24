Feature: Add of DELETE request
  As a User of Caddis
  I want to add a DELETE request with return data
  So I can mock a service call

  Background: Caddis Started
    Given The Caddis server has started

  Scenario: GET request exposed at uri
    When I submit a "DELETE" request with response JSON:
    """
    {
      "method": "delete",
      "uri": "/user/:id",
      "response": {
        "result": true
      }
    }
    """
    Then The JSON is returned by issuing a "DELETE" at the specified uri:
    """
    {
      "result": true
    }
    """