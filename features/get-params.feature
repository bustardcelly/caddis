Feature: Add of Request with URI Params
  As a User of Caddis
  I want to add a GET request with uri params
  So I can mock a service call

  Background: Caddis Started
    Given The Caddis server has started

  Scenario: Request with URI params responds
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
    Then The JSON response from a "GET" request to defined url:
    """
    {
      "name": "foo"
    }
    """