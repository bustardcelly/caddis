Feature: Respond with Status Code
  As a User of Caddis
  I want to add a RESTful request with a specified status code
  So I can mock a service call with a specific status response

  Background: Caddis Started
    Given The Caddis server has started

  Scenario: Request with Response Status Code
    When I submit a "GET" request with response JSON:
    """
    {
      "method": "get",
      "uri": "/user/:id",
      "response": {
        "name": "foo"
      },
      "status": 400
    }
    """
    Then The status code response received is 400 with:
    """
    {
      "name": "foo"
    }
    """